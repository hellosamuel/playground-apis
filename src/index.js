import Koa from 'koa'
import Router from './router'

const app = new Koa()

app.use(Router.routes()).use(Router.allowedMethods())

const port = 8000
app.listen(port, () => {
  console.log(`server is listening to port ${port}`)
})
