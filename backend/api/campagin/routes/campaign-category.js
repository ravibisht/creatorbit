import {Router} from 'express'

import {create, deleteCategory, getAllCategories, getCategory, update} from '../controller'
import authorizationMiddleWare from "../../../core/middleware/authorizationMiddleWare.js";
import fileUploadMiddleWare from "../../../core/middleware/fileUploadMiddleWare.js";

const router = Router()

router.route('/create').post(
    authorizationMiddleWare,
    fileUploadMiddleWare('image', 'image', process.env.CAMPAIGN_CATEGORY_IMAGE_PATH,'',''),
    create
)


router.route('/:categoryId').patch(
    authorizationMiddleWare,
    fileUploadMiddleWare('image', 'image', process.env.CAMPAIGN_CATEGORY_IMAGE_PATH,'',''),
    update
)

router.route('/:categoryId').get(getCategory)

router.route('/').get(getAllCategories)

router.route('/:categoryId').delete(authorizationMiddleWare, deleteCategory)


export default router
