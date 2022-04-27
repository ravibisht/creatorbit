import {Router} from 'express'
import {forgotPassword, getUserByUsername, login, register, resetPassword, updateProfile,} from '../controller'
import authorizationMiddleWare from "../../../core/middleware/authorizationMiddleWare.js";
import fileUploadMiddleWare from "../../../core/middleware/fileUploadMiddleWare.js";
import {MAX_PROFILE_PICTURE_SIZE} from "../../../core/validation/index.js";

const router = Router()

router.route('/register').post(
    fileUploadMiddleWare(
        'profilePicture',
        'image',
        process.env.USER_IMAGE_PATH,
        `Max Profile Picture Size ${MAX_PROFILE_PICTURE_SIZE / 1024}`
    ),
    register
)
router.route('/login').post(login)
router.route('/:username').get(getUserByUsername)
router.route('/update-profile').patch(authorizationMiddleWare, updateProfile,)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:token').post(resetPassword)

export default router
