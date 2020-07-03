import Router from '@koa/router'
import * as postsController from './posts-controller'
import checkLoggedIn from '../../lib/checkLoggedIn'

const posts = new Router()

posts.get('/', postsController.list)
posts.post('/', checkLoggedIn, postsController.create)

const post = new Router()
post.get('/', postsController.read)

posts.use('/:id', postsController.getPostById, post.routes())

export default posts
