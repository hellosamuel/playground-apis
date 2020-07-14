import Router from '@koa/router'
import * as postsController from './posts-controller'
import checkLoggedIn from '../../lib/checkLoggedIn'

const posts = new Router()

posts.get('/', postsController.list)
posts.post('/', checkLoggedIn, postsController.create)

const post = new Router()
post.get('/', postsController.read)
post.patch(
  '/',
  checkLoggedIn,
  postsController.checkOwnPost,
  postsController.update
)
post.delete(
  '/',
  checkLoggedIn,
  postsController.checkOwnPost,
  postsController.remove
)

posts.use('/:id', postsController.getPostById, post.routes())

export default posts
