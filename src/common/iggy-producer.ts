// import fetch from 'node-fetch'

// import { TransactionObject } from '../mappings/interfaces'
// import { toJson } from './utils'

// function currentTimestampInSeconds(): number {
//   return Math.floor(Date.now() / 1000)
// }

// export class IggyProducer {
//   url: string
//   requestHeaders: {
//     'Content-Type': 'application/json'
//     Authorization: string
//   }

//   constructor(url: string) {
//     const accessToken = process.env.ACCESS_TOKEN
//     if (!accessToken) {
//       throw new Error(`ACCESS_TOKEN env variable is undefined`)
//     }

//     this.url = url
//     this.requestHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` }
//   }

//   static async create(url: string): Promise<IggyProducer> {
//     const producer = new IggyProducer(url)

//     await producer.createStream()
//     await producer.createTopic()

//     return producer
//   }

//   private async createStream(stream_id = 1, name = 'stream1'): Promise<void> {
//     const response = await fetch(`${this.url}/streams`, {
//       method: 'POST',
//       body: JSON.stringify({
//         stream_id,
//         name,
//       }),
//       headers: this.requestHeaders,
//     })

//     const data = response.ok ? await response.json() : await response.text()
//     const status = response.status

//     logger.info(JSON.stringify(data))
//     logger.info(`status: ${status}`)

//     if (data && status === 400 && JSON.parse(data).code === 'stream_name_already_exists') {
//       return
//     }

//     if (data && status !== 201) {
//       throw new Error(`Failed to create stream. Reason: ${data} got status ${status}`)
//     }
//   }

//   private async createTopic(stream_id = 1, topic_id = 1, name = 'topic1'): Promise<void> {
//     const response = await fetch(`${this.url}/streams/${stream_id}/topics`, {
//       method: 'POST',
//       body: JSON.stringify({
//         topic_id: topic_id,
//         name: name,
//         replication_factor: 1,
//         partitions_count: 3,
//         compression_algorithm: 'none',
//       }),
//       headers: this.requestHeaders,
//     })

//     const data = response.ok ? await response.json() : await response.text()
//     const status = response.status

//     logger.info(JSON.stringify(data))
//     logger.info(`status: ${status}`)

//     if (data && status === 400 && JSON.parse(data).code === 'topic_name_already_exists') {
//       return
//     }

//     if (data && status !== 201) {
//       throw new Error(`Failed to create stream. Reason: ${data} got status ${status}`)
//     }
//   }

//   async postMessage(message: TransactionObject): Promise<void> {
//     const response = await fetch(`${this.url}/streams/1/topics/1/messages`, {
//       body: JSON.stringify({
//         partitioning: {
//           kind: 'balanced',
//           value: '',
//         },
//         messages: [
//           {
//             id: currentTimestampInSeconds(),
//             payload: Buffer.from(toJson(message)).toString('base64'),
//           },
//         ],
//       }),
//       method: 'POST',
//       headers: this.requestHeaders,
//     })

//     const status = response.status
//     logger.debug(`status: ${status}`)

//     if (response.status !== 201) {
//       logger.error(`${await response.text()}`)
//       throw new Error(`Failed to post message to iggy server. Got ${response.status} status from server`)
//     }
//   }
// }
