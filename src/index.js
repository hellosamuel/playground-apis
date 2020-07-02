import Koa from 'koa'
import Router from '@koa/router'
import koaBody from 'koa-body'
import Config, { setCors } from './config'
import { requestLogger, errorLogger } from './logger'
import api from './api'

console.log(process.env.NODE_ENV)

const app = new Koa()
const router = new Router()

router.use('/api', api.routes())

app.use(koaBody())
app.use(requestLogger).use(errorLogger)

app.use(setCors())
app.use(router.routes()).use(router.allowedMethods())

app.listen(Config.port, () => {
  console.log(`App is listening to port ${Config.port}`)
})
