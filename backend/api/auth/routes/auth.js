import { Router } from 'express'
import {
    forgotPassword,
    getUserByUsername,
    login,
    register,
    registerView,
    loginView,
    resetPassword,
    getMyProfile,
    updateProfile,
} from '../controller'

import authorizationMiddleWare from '../../../core/middleware/authorizationMiddleWare.js'
import fileUploadMiddleWare from '../../../core/middleware/fileUploadMiddleWare.js'
import { MAX_PROFILE_PICTURE_SIZE } from '../../../core/validation/index.js'
import {logout} from "../controller/auth.js";

const router = Router()
router
    .route('/register')
    .get(registerView)
    .post(
        fileUploadMiddleWare(
            'profilePicture',
            'image',
            process.env.USER_IMAGE_PATH,
            `Max Profile Picture Size ${MAX_PROFILE_PICTURE_SIZE / 1024}`,
        ),
        register,
    )

router.route('/login').get(loginView).post(login)

router.route('/update-profile').all(authorizationMiddleWare).post(updateProfile)

router.route('/logout').get(logout)

router.get('/my-profile', authorizationMiddleWare, getMyProfile)
router.route('/reset-password/:token').post(resetPassword)
router.route('/:username').get(getUserByUsername)

export default router
