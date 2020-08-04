import * as yup from 'yup'
import sanitizeHtml from 'sanitize-html'

import Database from '../../models'

const { Sequelize, Post, User } = Database

const sanitizeOption = {
  allowedTags: [
    'h1',
    'h2',
    'b',
    'i',
    'u',
    's',
    'p',
    'ul',
    'ol',
    'li',
    'blockquote',
    'a',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src'],
    li: ['class'],
  },
  allowedSchemes: ['data', 'http'],
}

export const getPostById = async (ctx, next) => {
  const { id } = ctx.params
  const postId = parseInt(id, 10)

  try {
    const post = await Post.findByPk(postId, {
      include: [{ model: User, as: 'Author', attributes: ['username'] }],
    })

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

export const checkOwnPost = async (ctx, next) => {
  const { user, post } = ctx.state
  if (user.id !== post.userId) {
    ctx.status = 403
    return
  }
  return next()
}

const removeHtmlAndShorten = content => {
  const filtered = sanitizeHtml(content, {
    allowedTags: [],
  })
  return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`
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
    ...(tag ? { tags: { [Sequelize.Op.contains]: [tag] } } : {}),
  }
  const pageSize = 3

  try {
    const posts = await Post.findAndCountAll({
      include: [{ model: User, as: 'Author', attributes: ['username'] }],
      // include: ['Author'],
      where: conditions,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['id', 'DESC']],
    })
    ctx.set('last-page', Math.ceil(posts.count / pageSize))
    ctx.body = posts.rows.map(row => {
      const post = row.get({ plain: true })
      return {
        ...post,
        content: removeHtmlAndShorten(post.content),
      }
    })
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
      content: sanitizeHtml(validPost.content, sanitizeOption),
      userId: ctx.state.user.id,
    })

    const post = await Post.findByPk(newPost.id, {
      include: [{ model: User, as: 'Author', attributes: ['username'] }],
    })

    ctx.body = post
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      ctx.status = 400
      ctx.body = e.message
      return
    }
    ctx.throw(500, e)
  }
}

export const update = async ctx => {
  const postId = parseInt(ctx.params.id, 10)

  const postSchema = yup.object({
    title: yup.string().trim(),
    content: yup.string(),
    tags: yup.array().of(yup.string().trim()),
  })

  try {
    const validPost = await postSchema.validate({ ...ctx.request.body })

    if (validPost.content) {
      validPost.content = sanitizeHtml(validPost.content, sanitizeOption)
    }

    const [result, updatedPost] = await Post.update(validPost, {
      where: { id: postId },
      returning: true,
    })

    if (!result) {
      ctx.status = 404
      return
    }

    const post = await Post.findByPk(updatedPost[0].id, {
      include: [{ model: User, as: 'Author', attributes: ['username'] }],
    })

    ctx.body = post
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      ctx.status = 400
      ctx.body = e.message
      return
    }
    ctx.throw(500, e)
  }
}

export const remove = async ctx => {
  const { post } = ctx.state

  try {
    await post.destroy()
    ctx.status = 204
  } catch (e) {
    ctx.throw(500, e)
  }
}
