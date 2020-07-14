import cors from '@koa/cors'

require('dotenv').config()

const Config = {
  port: Number(process.env.PORT) || 8000,
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
}

export function setCors() {
  const corsOption = {
    origin: () => process.env.CORS_ORIGIN || '*',
  }
  return cors(corsOption)
}

export default Config
