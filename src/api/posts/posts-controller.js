import * as yup from 'yup'

import Database from '../../models'

const { Sequelize, Post, User } = Database

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
  const page = parseInt(ctx.query.page || '1', 10)
  if (page < 1) {
    ctx.status = 400
    return
  }

  const { username, tag } = ctx.query
  const conditions = {
    ...(username ? { '$Author.username$': username } : {}),
    ...(tag ? { tags: { [Sequelize.Op.contains]: tag } } : {}),
  }
  const pageSize = 10

  try {
    const posts = await Post.findAndCountAll({
      include: [{ model: User, as: 'Author', attributes: ['username'] }],
      // include: ['Author'],
      where: conditions,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['id', 'DESC']],
    })
    ctx.set('Last-Page', Math.ceil(posts.count / pageSize))
    ctx.body = posts.rows
  } catch (e) {
    ctx.throw(500, e)
  }
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
