import Router from '@koa/router'

import Posts from './posts'

const router = new Router()

router.use('/posts', Posts.routes(), Posts.allowedMethods())

router.get('/healthCheck', ctx => {
  ctx.body = 'healthy'
})

export default router
