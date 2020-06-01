import Router from '@koa/router'

import PostsController from '../controller/postsController'

const PostsRouter = new Router()
const { getAllPosts, getPost } = new PostsController()

PostsRouter.get('/', getAllPosts)
PostsRouter.get('/:postId', getPost)

export default PostsRouter
