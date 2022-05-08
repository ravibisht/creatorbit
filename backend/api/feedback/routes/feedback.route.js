import { Router } from 'express'
import { create, feedbackView } from '../controller'
import authorizationMiddleWare from '../../../core/middleware/authorizationMiddleWare'

const router = Router()

router
    .route('/')
    .all(authorizationMiddleWare).get(feedbackView).post(create)

export default router
