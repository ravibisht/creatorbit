import { Router } from 'express'
import {
    login,
    register,
    getUserByUsername,
    forgotPassword,
    resetPassword, updateProfile,
} from '../controller'
import authorizationMiddleWare from "../../../core/middleware/authorizationMiddleWare.js";

const router = Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/:username').get(getUserByUsername)
router.route('/update-profile').patch(authorizationMiddleWare,updateProfile,)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:token').post(resetPassword)

export default router
