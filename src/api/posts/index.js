import Router from '@koa/router'
import * as postsController from './posts-controller'

const posts = new Router()

posts.get('/', postsController.list)

const post = new Router()
post.get('/', postsController.read)

posts.use('/:id', postsController.getPostById, post.routes())

export default posts
