import { Router } from 'express'
import { login, register, getUserByUsername } from '../controller'

const router = Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/:username').get(getUserByUsername)

export default router
