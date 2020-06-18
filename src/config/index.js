import envs from 'dotenv'
import cors from '@koa/cors'

envs.config()

const Config = {
  port: Number(process.env.PORT) || 8000,
}

export function setCors() {
  const corsOption = {
    origin: () => process.env.CORS_ORIGIN || '*',
  }
  return cors(corsOption)
}

export default Config
