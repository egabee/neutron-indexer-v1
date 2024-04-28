import dotenv from 'dotenv'
import { ensureEnvs } from './common/utils'

dotenv.config({ path: '/app/.env' })

ensureEnvs()

export * from './mappings/tx'