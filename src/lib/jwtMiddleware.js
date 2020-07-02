import jwt from 'jsonwebtoken'
import Database from '../db/models'

const { User } = Database

const jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get('playground_access_token')
  if (!token) return next()

  try {
    const { username, createdAt, exp } = jwt.verify(
      token,
      process.env.JWT_SECRET
    )
    ctx.state.user = { username, createdAt }

    // Less than 1hour, refresh token
    const now = Math.floor(Date.now() / 1000)
    if (exp - now < 60 * 60) {
      const user = await User.findByUsername(username)
      const newToken = user.generateToken()
      ctx.cookies.set('playground_access_token', newToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      })
    }

    return next()
  } catch (e) {
    return next()
  }
}

export default jwtMiddleware
