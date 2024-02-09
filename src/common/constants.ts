import assert from 'assert'

export const BIGINT_ZERO = BigInt(0)
export const BIGINT_ONE = BigInt(1)
export const EMPTY_STRING = ''

assert(process.env.KAFKA_TOPIC, 'Kafka topic is not set')

export const TOPIC_MESSAGE = process.env.KAFKA_TOPIC!
