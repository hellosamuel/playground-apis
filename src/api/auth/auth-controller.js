import { users } from '../../db/models'

export const register = async ctx => {
  const { username, password } = ctx.request.body
  try {
    const user = users.build({ username, password })
    await user.save()
    console.log(user)
  } catch (e) {
    ctx.throw(500, e)
  }
  ctx.body = { username, password }
}

export const login = ctx => {

}

export const check = ctx => {

}

export const logout = ctx => {

}
