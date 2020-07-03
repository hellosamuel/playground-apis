import * as yup from 'yup'

import Database from '../../db/models'

const { Post } = Database

const posts = [
  {
    id: 1,
    title: 'Title 1',
    body: 'Body 1',
  },
  {
    id: 2,
    title: 'Title 2',
    body: 'Body 2',
  },
  {
    id: 3,
    title: 'Title 3',
    body: 'Body 3',
  },
]

export const getPostById = async (ctx, next) => {
  const { id } = ctx.params
  const postId = parseInt(id, 10)

  try {
    const post = await Post.findByPk(postId)

    if (!post) {
      ctx.status = 404
      return
    }

    ctx.state.post = post

    return next()
  } catch (e) {
    ctx.throw(500, e)
  }
}

export const list = async ctx => {
  ctx.body = posts
}

export const read = async ctx => {
  ctx.body = ctx.state.post
}

export const create = async ctx => {
  const { title, content, tags } = ctx.request.body

  const postSchema = yup.object({
    title: yup.string().trim().required(),
    content: yup.string(),
    tags: yup.array().of(yup.string().trim()),
  })

  try {
    const validPost = await postSchema.validate({ title, content, tags })
    const newPost = await Post.create({
      ...validPost,
      userId: ctx.state.user.id,
    })

    ctx.body = newPost
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      ctx.status = 400
      ctx.body = e.message
      return
    }
    ctx.throw(500, e)
  }
}
