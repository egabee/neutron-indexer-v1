import { CosmosTransaction } from '@subql/types-cosmos'
import { TextDecoder } from 'util'
// import { AuthInfo, TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx'

// import { IggyProducer } from '../common/iggy-producer'
import { Any, Any as ProtoAny } from '../types/proto-interfaces/google/protobuf/any'
import { addToUnknownMessageTypes, decodeBase64IfEncoded, isEmptyStringObject, toJson } from '../common/utils'
import { CustomAuthInfo, EventLog, GenericMessage, TransactionObject, TxExtensions } from './interfaces'

// let iggyProducer: IggyProducer

export async function handleTx(tx: CosmosTransaction): Promise<void> {
  // if (!iggyProducer) {
  //   iggyProducer = await IggyProducer.create(process.env.IGGY_URL!)
  // }

  const { height } = tx.block.header

  const messages: GenericMessage[] = []

  for (const { typeUrl, value } of tx.decodedTx.body.messages) {
    const knownType = registry.lookupType(typeUrl)

    if (!knownType || isEmptyStringObject(knownType)) {
      addToUnknownMessageTypes({ type: typeUrl, blocks: [height] })
      continue
    }

    try {
      const decodedMessage = decodeNestedMessages(knownType.decode(value), { typeUrl, value }, height)
      messages.push(decodedMessage)
    } catch (error) {
      throw error // throw the error to stop the indexer
    }
  }

  const signatures = Buffer.from(
    new Uint8Array(tx.decodedTx.signatures.flatMap((signature) => Array.from(signature))),
  ).toString('base64')

  const transaction = createTransactionObject(
    tx,
    messages,
    decodeAuthInfo(tx.decodedTx.authInfo),
    signatures,
    decodeExtensions(tx.decodedTx.body),
  )

  logger.info(`Full tx: ${toJson(transaction)}`)

  // await iggyProducer.postMessage(transaction)
}

/**
 * Decode nested messages if any
 * @param decodedMessage any
 * @param originalMessage ProtoAny
 * @param block number
 * @returns GenericMessage
 */
function decodeNestedMessages(decodedMessage: any, originalMessage: ProtoAny, block: number): GenericMessage {
  const { typeUrl } = originalMessage

  if (
    [
      '/cosmwasm.wasm.v1.MsgExecuteContract',
      '/cosmwasm.wasm.v1.MsgMigrateContract',
      '/cosmwasm.wasm.v1.MsgInstantiateContract',
    ].includes(typeUrl)
  ) {
    decodedMessage.msg = JSON.parse(new TextDecoder().decode(Buffer.from(decodedMessage.msg)))
  }

  if (typeUrl === '/ibc.core.client.v1.MsgCreateClient') {
    decodedMessage.clientState = tryDecodeMessage(decodedMessage.clientState as ProtoAny, block)
  }

  if (typeUrl === '/ibc.core.client.v1.MsgUpdateClient') {
    decodedMessage.clientMessage = tryDecodeMessage(decodedMessage.clientMessage as ProtoAny, block)
  }

  if (typeUrl === '/ibc.core.channel.v1.MsgAcknowledgement') {
    decodedMessage.packet.data = JSON.parse(new TextDecoder().decode(Buffer.from(decodedMessage.packet.data)))
  }

  if (typeUrl === '/ibc.core.channel.v1.MsgRecvPacket') {
    decodedMessage.packet.data = JSON.parse(new TextDecoder().decode(Buffer.from(decodedMessage.packet.data)))
  }

  if (typeUrl === '/cosmos.authz.v1beta1.MsgGrant') {
    const authorization = tryDecodeMessage(decodedMessage.grant.authorization as ProtoAny, block)
    decodedMessage.grant = { ...decodedMessage.grant, authorization }
  }

  if (typeUrl === '/cosmos.authz.v1beta1.MsgExec') {
    const msgs = []
    for (const msg of decodedMessage.msgs) {
      msgs.push(tryDecodeMessage(msg, block))
    }
    decodedMessage.msgs = msgs
  }

  return { ...decodedMessage, type: typeUrl }
}

/**
 * Try to decode message if can't decode then returns undefined
 * @param param0 ProtoAny
 * @param block number
 * @returns any | undefined
 */
function tryDecodeMessage({ typeUrl, value }: ProtoAny, block: number): any {
  const knownType = registry.lookupType(typeUrl)

  if (!knownType || isEmptyStringObject(knownType)) {
    addToUnknownMessageTypes({ type: typeUrl, blocks: [block] })
    throw new Error(`Unknown type detected. Type url: ${typeUrl}`)
  }

  try {
    return { ...knownType.decode(value), type: typeUrl }
  } catch (error) {
    logger.error(error, `Failed to decode message`)
    throw error
  }
}

/**
 * Creates a transaction object from input paramaters. Messages and events are decoded.
 * @param cosmosTx CosmosTransaction
 * @param messages GenericMessage[]
 * @returns TransactionObject
 */
function createTransactionObject(
  cosmosTx: CosmosTransaction,
  messages: GenericMessage[],
  authInfo: CustomAuthInfo,
  signatures: string,
  extentions: TxExtensions,
): TransactionObject {
  const {
    tx: { events, gasUsed, gasWanted, log, code },
    block: { header },
  } = cosmosTx

  const txEvents: EventLog[] = events.map(({ type, attributes }: any) => ({
    type,
    attributes: attributes.map(({ key, value }: any) => ({
      key: decodeBase64IfEncoded(key),
      value: decodeBase64IfEncoded(value),
    })),
  }))

  return {
    id: cosmosTx.hash,
    events: txEvents,
    messages,
    log,
    gasUsed: gasUsed.toString(),
    gasWanted: gasWanted.toString(),
    success: code === 0,
    blockNumber: header.height,
    timestamp: BigInt(header.time.valueOf()).toString(),
    chainId: header.chainId,
    authInfo,
    signatures,
    memo: cosmosTx.decodedTx.body.memo,
    timeoutHeight: cosmosTx.decodedTx.body.timeoutHeight.toString(),
    extensionOptions: extentions.extensionOptions,
    nonCriticalExtensionOptions: extentions.nonCriticalExtensionOptions,
  }
}

function decodeAuthInfo({ fee, signerInfos }: any): CustomAuthInfo {
  const authSignerInfos = []

  for (const { publicKey: pkey, sequence, modeInfo } of signerInfos) {
    let pubKeyValue

    if (pkey) {
      const msgType = registry.lookupType(pkey.typeUrl)
      if (!msgType) {
        throw new Error(`Message type not found for pubKey.typeUrl = ${pkey.typeUrl}`)
      }

      pubKeyValue = msgType.decode(pkey.value)
    }

    try {
      pubKeyValue = pubKeyValue ? JSON.parse(JSON.stringify(pubKeyValue)) : {}
    } catch (err) {
      logger.error(`JSON ser/deser public key error. Reason ${toJson(err)}`)
    }

    authSignerInfos.push({
      pubKey: { ...pubKeyValue, type: pkey?.typeUrl },
      sequence: sequence.toString(),
      modeInfo,
    })
  }

  return {
    signerInfos: authSignerInfos,
    fee,
  }
}

function decodeExtensions(txBody: any): TxExtensions {
  const extensionOptions = txBody.extensionOptions.map((ext: Any) => {
    const ty = registry.lookupType(ext.typeUrl)
    if (!ty) {
      throw new Error(`Unknown type detected for extensionOptions ${ext.typeUrl}`)
    }

    return { type: ext.typeUrl, value: ty.decode(ext.value) }
  })

  const nonCriticalExtensionOptions = txBody.nonCriticalExtensionOptions.map((ext: Any) => {
    const ty = registry.lookupType(ext.typeUrl)
    if (!ty) {
      throw new Error(`Unknown type detected for extensionOptions ${ext.typeUrl}`)
    }

    return { type: ext.typeUrl, value: ty.decode(ext.value) }
  })

  return { extensionOptions, nonCriticalExtensionOptions }
}
