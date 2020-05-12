import Router from '@koa/router'

import PostsController from '../controller/posts'

const router = new Router()
const { getAllPosts, getPost } = PostsController

router.get('/', getAllPosts)
router.get('/:postId', getPost)

export default router
