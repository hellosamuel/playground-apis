import Koa from 'koa'
import koaBody from 'koa-body'
import Config from './config'
import { requestLogger, errorLogger } from './logger'
import Router from './router'

const app = new Koa()

app.use(koaBody())
app.use(requestLogger).use(errorLogger)

app.use(Config.server.cors())
app.use(Router.routes()).use(Router.allowedMethods())

app.listen(Config.server.port, () => {
  console.log(`App is listening to port ${Config.server.port}`)
})
