import { CosmosTransaction } from '@subql/types-cosmos'
import { TextDecoder } from 'util'

import { Any as ProtoAny } from '../types/proto-interfaces/google/protobuf/any'
import { TOPIC_MESSAGE } from '../common/constants'
import { sendBatchOfMessagesToKafka } from '../common/kafka-producer'
import { addToUnknownMessageTypes, isEmptyStringObject, toJson } from '../common/utils'
import { EventLog, GenericMessage, TransactionObject } from './interfaces'

export async function handleTx(tx: CosmosTransaction): Promise<void> {
  const { height } = tx.block.header
  logger.info(`-------- ${height} -----------`)

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

  const transaction = createTransactionObject(tx, messages)
  await sendBatchOfMessagesToKafka({ topic: TOPIC_MESSAGE, message: transaction })
  logger.info(`Full tx: ${toJson(transaction)}`)
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
function createTransactionObject(cosmosTx: CosmosTransaction, messages: GenericMessage[]): TransactionObject {
  const {
    tx: { events, gasUsed, gasWanted, log, code },
    block: { header },
  } = cosmosTx

  const txEvents: EventLog[] = events.map(({ type, attributes }: any) => ({
    type,
    attributes: attributes.map(({ key, value }: any) => ({
      key: key,
      value: value,
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
  }
}
