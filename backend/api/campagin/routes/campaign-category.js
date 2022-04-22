import {Router} from 'express'

import {create, update,deleteCategory} from '../controller'
import authorizationMiddleWare from "../../../core/middleware/authorizationMiddleWare.js";

const router = Router()

router.route('/').post(authorizationMiddleWare,create)
router.route('/:categoryId').patch(authorizationMiddleWare,update)
router.route('/:categoryId').delete(authorizationMiddleWare,deleteCategory)


export default router
