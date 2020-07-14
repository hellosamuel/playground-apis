import Koa from 'koa'
import Router from '@koa/router'
import koaBody from 'koa-body'

import Config, { setCors } from './config'
import { requestLogger, errorLogger } from './logger'
import api from './api'
import jwtMiddleware from './lib/jwtMiddleware'

const app = new Koa()
const router = new Router()

router.use('/api', api.routes())

app.use(setCors())

app.use(koaBody())
app.use(requestLogger).use(errorLogger)
app.use(jwtMiddleware)

app.use(router.routes()).use(router.allowedMethods())

app.listen(Config.port, () => {
  console.log(`App is listening to port ${Config.port}`)
})
