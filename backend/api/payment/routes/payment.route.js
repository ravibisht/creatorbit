import {Router} from 'express'
import {bankDetailView} from '../controller'
import authorizationMiddleWare from '../../../core/middleware/authorizationMiddleWare'
import {createOrUpdate} from "../controller/index.js";

const router = Router()

router
    .route('/')
    .all(authorizationMiddleWare).get(bankDetailView).post(createOrUpdate)

export default router
