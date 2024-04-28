import { Fee } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { Any as ProtoAny } from '../types/proto-interfaces/google/protobuf/any'

type Any = Record<string, any>

export interface GenericMessage {
  [key: string]: any
  type: string
  msg?: Any[]
  msgs?: Any[]
  clientMessage?: Any
}

// Represents a type that is not know by this indexer
export interface UnknownMessageType {
  // Message type name
  type: string
  // List of blocks that this message was found in
  blocks: number[]
}

export interface DecodedMessage {
  type: string
  [key: string]: any
}

export interface EventLog {
  type: string
  attributes: { key: string; value: string }[]
}
export interface TransactionObject {
  id: string
  // Events emitted from the transaction
  events: any
  // Messages included in transaction body - saved as json string
  messages: GenericMessage[]
  log: any
  success: boolean
  gasUsed: string
  gasWanted: string
  // Block number in which the balance was last modified
  blockNumber: number
  // Timestamp in which the balance was last modified
  timestamp: string
  chainId: string
  memo: string
  authInfo: CustomAuthInfo
  signatures: string
  timeoutHeight: string
  extensionOptions?: ExtensionOptions[]
  nonCriticalExtensionOptions?: NonCriticalExtensionOptions[]
}

export interface CustomAuthInfo {
  signerInfos: { pubKey: string; sequence: string; modeInfo: any }[]
  fee?: Fee
}

export interface TransactionTopic {
  topic: string
  message: TransactionObject
}

export interface CosmosDecodedMessage {
  clientMessage?: ProtoAny
  msgs?: ProtoAny[]
  msg?: Uint8Array
  allowance?: ProtoAny
  [key: string]: any // Add other possible properties
}

export interface ExtensionOptions {
  type: string
  value: any
}

export interface NonCriticalExtensionOptions extends ExtensionOptions {}

export interface TxExtensions {
  extensionOptions: ExtensionOptions[]
  nonCriticalExtensionOptions: NonCriticalExtensionOptions[]
}