import { createLogger, transports, format } from 'winston'

const { combine, colorize, splat, timestamp, printf } = format

const defaultFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`
})

const requestMsgFormat = `[%s] %s: %s
${'_'.repeat(50)} [Request]
%o

${'_'.repeat(50)} [Body]
%o
`

const errorMsgFormat = `[%s]
${'_'.repeat(50)} [Context]
%o

${'_'.repeat(50)} [Error]
%o
`

const logger = createLogger({
  format: combine(
    colorize(),
    splat(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    defaultFormat
  ),
  transports: [new transports.Console()],
})

const requestLogger = async (ctx, next) => {
  const { method, request } = ctx
  const { body, path } = request
  logger.info(requestMsgFormat, 'http', method, path, request, body)
  await next()
}

const errorLogger = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    ctx.status = error.status || 500
    ctx.body = error
    const moduleName = error.module || 'app'
    logger.error(errorMsgFormat, moduleName, ctx, error)
  }
}

export { requestLogger, errorLogger }
