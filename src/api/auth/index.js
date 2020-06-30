import Router from '@koa/router'
import * as authController from './auth-controller'

const auth = new Router()

auth.post('/register', authController.register)
auth.post('/login', authController.login)

export default auth
