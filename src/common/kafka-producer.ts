import { Kafka } from 'kafkajs'

import { toJson } from './utils'
import { TransactionObject, TransactionTopic } from '../mappings/interfaces'

const TOPIC = process.env.KAFKA_TOPIC!
const PARTITIONS = [0, 1, 2, 3, 4, 5]

function randomPartition(): number {
  return PARTITIONS[Math.floor(Math.random() * PARTITIONS.length)]
}

const kafka = new Kafka({
  brokers: process.env.KAFKA_BROKERS!.split(',') || [],
  clientId: 'coreum-producer-client',
})

const producer = kafka.producer({ allowAutoTopicCreation: true })
let producerConnected = false

async function connectProducer(): Promise<void> {
  await producer.connect()
  producerConnected = true
}

//eslint-disable-next-line
async function disconnectProducer(): Promise<void> {
  await producer.disconnect()
}

connectProducer()

/**
 * Send a batch of messages to Kafka
 * @param messages - An array of messages to send
 * @param topic - The topic to send the messages to
 */
export async function sendBatchOfMessagesToKafka(message: TransactionObject): Promise<void> {
  if (!producerConnected) {
    await connectProducer()
  }

  try {
    const messageResults = await producer.sendBatch({
      topicMessages: [
        {
          messages: [{ value: toJson(message), partition: randomPartition() }],
          topic: TOPIC,
        },
      ],
    })
    const failedMessages = messageResults.filter((messageResult) => messageResult.errorCode !== 0)

    if (failedMessages.length) {
      logger.error(`Error pushing ${failedMessages.length} messages to Kafka`)
    }
  } catch (error) {
    logger.error(`Error pushing batch of messages to Kafka: ${JSON.stringify(error)}`)
    await sendFailureReport({ message, topic: TOPIC })
  }
}

/**
 * This function send the transactions that didnt make to kafka so later we can manually index them
 */
async function sendFailureReport({ topic, message }: TransactionTopic): Promise<void> {
  if (!producerConnected) {
    await connectProducer()
  }
  try {
    const messageResults = await producer.sendBatch({
      topicMessages: [
        {
          messages: [
            { value: toJson({ txHash: message.id, blockNumber: message.blockNumber, chainId: process.env.CHAIN_ID }) },
          ],
          topic: `${topic}_failed`,
        },
      ],
    })
    const failedMessages = messageResults.filter((messageResult) => messageResult.errorCode !== 0)

    if (failedMessages.length) {
      logger.error(`Error pushing ${failedMessages.length} messages to Kafka`)
    }
  } catch (error) {
    logger.error(`Error pushing failure messages to Kafka: ${JSON.stringify(error)}`)
    throw error // Rethrow the error for better visibility at the caller level
  }
}