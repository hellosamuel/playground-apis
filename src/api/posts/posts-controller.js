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
  const post = posts.find(p => p.id === postId)

  if (!post) {
    ctx.throw(404)
  }
  ctx.state.post = post
  return next()
}

export const list = async ctx => {
  ctx.body = posts
}

export const read = async ctx => {
  ctx.body = ctx.state.post
}
