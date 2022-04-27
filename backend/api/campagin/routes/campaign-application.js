import {Router} from 'express'
import {create, deleteById, findById, getCampaignApplicationByUser, update} from '../controller/campaign-application'
import authorizationMiddleWare, {restrictTo} from "../../../core/middleware/authorizationMiddleWare.js";
import Role from "../../auth/enums/Role.js";

const router = Router()

router.route('/')
    .post(create)
    .get(getCampaignApplicationByUser)

router.route('/:campaignApplicationId')
    .patch(restrictTo(Role.CREATOR), update)
    .delete(deleteById)
    .get(findById)


/*router.route('/:campaignId')
    .get(getCampaignByID)
    .patch(
        authorizationMiddleWare, fileUploadMiddleWare('image', 'image', process.env.CAMPAIGN_IMAGE_PATH, MAX_CAMPAIGN_IMAGE_SIZE, `Max Image  Size ${MAX_CAMPAIGN_VIDEO_SIZE} MB`),
        fileUploadMiddleWare('video', 'video', process.env.CAMPAIGN_VIDEO_PATH, MAX_CAMPAIGN_VIDEO_SIZE, `Max Video Size ${MAX_CAMPAIGN_VIDEO_SIZE} MB`),
        update
    ).delete(deleteById)

router.route('/').get(getAllCampaign)*/

export default router