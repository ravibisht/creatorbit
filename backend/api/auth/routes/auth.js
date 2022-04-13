import { Router } from 'express'
import { register } from '../controller/auth'

const router = Router()

router.route('/register').post(register)
export default router
