import jwt from 'jsonwebtoken'
import Database from '../models'
import { decrypt } from './cryptoHelper'

const { User } = Database

const jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get('playground_access_token')
  if (!token) return next()

  try {
    const { payload, exp } = jwt.verify(token, process.env.JWT_SECRET)
    const { id, username } = JSON.parse(decrypt(payload))
    ctx.state.user = { id, username }

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
