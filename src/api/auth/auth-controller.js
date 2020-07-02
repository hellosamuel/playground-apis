import Database from '../../db/models'

const { User } = Database

export const register = async ctx => {
  const { username, password } = ctx.request.body
  try {
    const user = await User.findByUsername(username)
    if (user) {
      ctx.status = 409
      ctx.body = 'Already Exist Username'
      return
    }
    // Way 1
    // const user = await User.create({ username, originPassword })

    // Way 2
    const newUser = User.build({ username, password })
    await newUser.save()

    ctx.body = newUser.serialize()
  } catch (e) {
    ctx.throw(500, e)
  }
}

export const login = async ctx => {
  const { username, password } = ctx.request.body
  try {
    // This is for test! Don't reveal about what information doesn't match
    const user = await User.findByUsername(username)
    if (!user) {
      ctx.status = 401
      ctx.body = 'No Username'
      return
    }

    const valid = await user.checkPassword(password)
    if (!valid) {
      ctx.status = 401
      ctx.body = 'Wrong Password'
      return
    }

    const accessToken = user.generateToken()

    ctx.cookies.set('playground_access_token', accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    })

    ctx.body = user.serialize()
  } catch (e) {
    ctx.throw(500, e)
  }
}

export const check = async ctx => {
  const { user } = ctx.state
  if (!user) {
    ctx.status = 401
    return
  }

  ctx.body = user
}

export const logout = async ctx => {
  ctx.cookies.set('playground_access_token')
  ctx.status = 204
}
