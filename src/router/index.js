import Router from '@koa/router'

import Posts from './postsRouter'
import Albums from './albumsRouter'

const router = new Router()

router.use('/posts', Posts.routes(), Posts.allowedMethods())
router.use('/albums', Albums.routes(), Albums.allowedMethods())

router.get('/healthCheck', ctx => {
  ctx.body = 'healthy'
})

export default router
