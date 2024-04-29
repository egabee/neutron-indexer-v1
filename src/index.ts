import dotenv from 'dotenv'
import { ensureEnvs } from '@egabee/cosmos-indexer-common/lib/utils'

dotenv.config({ path: '/app/.env' })

ensureEnvs()

export * from './mappings/tx'