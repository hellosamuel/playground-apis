import cors from '@koa/cors'

const Config = {
  server: {
    port: Number(process.env.PORT) || 8000,
    cors: () => {
      const corsOption = {
        origin: () => process.env.CORS_ORIGIN || '*',
      }
      return cors(corsOption)
    },
  },
}

export default Config
