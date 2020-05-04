import Router from '@koa/router'

import Posts from '../controller/posts'

const router = new Router()
const { getAllPosts, getPost } = Posts

router.get('/', getAllPosts)
router.get('/:postId', getPost)

export default router
