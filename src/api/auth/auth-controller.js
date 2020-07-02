import Database from '../../db/models'

export const register = async ctx => {
  const { username, password } = ctx.request.body
  try {
    const user = await Database.User.findByUsername(username)
    if (user) ctx.throw(409, 'Already Exist Username')

    // way no.1
    // const user = await User.create({ username, originPassword })

    // way no.2
    const newUser = Database.User.build({ username, password })
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
    const user = await Database.User.findByUsername(username)
    if (!user) ctx.throw(401, 'No Username')

    const valid = await user.checkPassword(password)
    if (!valid) ctx.throw(401, 'Wrong Password')

    ctx.body = user.serialize()
  } catch (e) {
    ctx.throw(500, e)
  }
}

export const check = ctx => {

}

export const logout = ctx => {

}
