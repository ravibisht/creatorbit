import {Router} from 'express'
import {login, loginView, logout,} from '../controller/auth.js'

const router = Router()

router.route('/login').get(loginView).post(login)

router.route('/logout').get(logout)

export default router
