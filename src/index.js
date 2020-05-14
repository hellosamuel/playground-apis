import Koa from 'koa'
import Config from './config'
import Router from './router'

const app = new Koa()

app.use(Config.server.cors())
app.use(Router.routes()).use(Router.allowedMethods())

app.listen(Config.server.port, () => {
  console.log(`App is listening to port ${Config.server.port}`)
})
