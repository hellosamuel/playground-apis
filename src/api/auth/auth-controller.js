import * as yup from 'yup'
import Database from '../../db/models'

const { User } = Database

export const register = async ctx => {
  const { username, password } = ctx.request.body

  const userSchema = yup.object({
    username: yup.string().required().trim().min(5).max(20),
    password: yup.string().required(),
  })

  try {
    const user = await User.findByUsername(username)
    if (user) {
      ctx.status = 409
      ctx.body = 'Already Exist Username'
      return
    }

    const validUser = await userSchema.validate({ username, password })
    // Way 1
    // const newUser = await User.create(validUser)

    // Way 2
    const newUser = User.build(validUser)
    await newUser.save()

    ctx.body = newUser.serialize()
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      ctx.status = 400
      ctx.body = e.message
      return
    }
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
