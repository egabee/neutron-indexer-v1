import { Kafka } from 'kafkajs'
import * as dotenv from 'dotenv'

dotenv.config()

const kafka = new Kafka({
  brokers: process.env.KAFKA_BROKERS!.split(',') || [],
})

const producer = kafka.producer()

async function connectProducer(): Promise<void> {
  await producer.connect()
}

//eslint-disable-next-line
async function disconnectProducer(): Promise<void> {
  await producer.disconnect()
}

connectProducer()

kafka
  .admin()
  .createTopics({ topics: [{ topic: 'txs1', numPartitions: 6 }] })
  .then((result) => {
    if (result) {
      console.log(`Topic created.`)
    } else {
      console.log(`Failed to create topic`)
    }
  })
  .catch(console.error)
  .finally(process.exit)