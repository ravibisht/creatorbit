import { Router } from 'express'
import {
    create, createCampaignView,
    deleteById,
    getAllCampaign, getBrandCampaignView,
    getCampaignByID,
    update,
} from '../controller/campagin'
import authorizationMiddleWare from '../../../core/middleware/authorizationMiddleWare.js'
import fileUploadMiddleWare from '../../../core/middleware/fileUploadMiddleWare.js'
import {
    MAX_CAMPAIGN_IMAGE_SIZE,
    MAX_CAMPAIGN_VIDEO_SIZE,
} from '../../../core/validation/validation.js'


const router = Router()


router.route('/create')
    .get(createCampaignView)
    .post(
        authorizationMiddleWare,
        fileUploadMiddleWare(
        'image',
        'image',
        process.env.CAMPAIGN_IMAGE_PATH,
        MAX_CAMPAIGN_IMAGE_SIZE,
        `Max Image  Size ${MAX_CAMPAIGN_VIDEO_SIZE} MB`,
    ),
    fileUploadMiddleWare(
        'video',
        'video',
        process.env.CAMPAIGN_VIDEO_PATH,
        MAX_CAMPAIGN_VIDEO_SIZE,
        `Max Video Size ${MAX_CAMPAIGN_VIDEO_SIZE} MB`,
    ),
    create,
)


router.route('/brand/').get(authorizationMiddleWare,getBrandCampaignView)

router
    .route('/:campaignId')

    .get(authorizationMiddleWare,getCampaignByID)
    .patch(
        authorizationMiddleWare,
        fileUploadMiddleWare(
            'image',
            'image',
            process.env.CAMPAIGN_IMAGE_PATH,
            MAX_CAMPAIGN_IMAGE_SIZE,
            `Max Image  Size ${MAX_CAMPAIGN_VIDEO_SIZE} MB`,
        ),
        fileUploadMiddleWare(
            'video',
            'video',
            process.env.CAMPAIGN_VIDEO_PATH,
            MAX_CAMPAIGN_VIDEO_SIZE,
            `Max Video Size ${MAX_CAMPAIGN_VIDEO_SIZE} MB`,
        ),
        update,
    )
    .delete(deleteById)


router.route('/').get(getAllCampaign)


export default router
