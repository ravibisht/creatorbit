import {Router} from 'express'
import {
    createOrUpdateCategoryView,
    dashboardView,
    getAllCampaignCategoryView,
    getAllCampaignView,
    getAllFeedbackView,
    getAllUsersView, getCampaignDetail,
    getReportBetween, getUserByUsername,
    showReportView
} from '../controller/dashboard.js'
import authorizationMiddleWare from "../../../core/middleware/authorizationMiddleWare.js";
import fileUploadMiddleWare from "../../../core/middleware/fileUploadMiddleWare.js";
import {create, deleteCategory, update} from "../../campagin/controller/index.js";

const router = Router()

router.route('/').get(dashboardView)
router.route('/show/users').get(getAllUsersView)
router.route('/show/campaign').get(getAllCampaignView)
router.route('/show/campaign-category').get(getAllCampaignCategoryView)
router.route('/show/feedback').get(getAllFeedbackView)

router.route('/show/report/view').get(showReportView)

router.route('/create/campaign-category').get(createOrUpdateCategoryView).post(
    authorizationMiddleWare,
    fileUploadMiddleWare('image', 'image', process.env.CAMPAIGN_CATEGORY_IMAGE_PATH,'',''),
    create
)

router.route('/update/campaign-category/:categoryId').get(createOrUpdateCategoryView).post(
    authorizationMiddleWare,
    fileUploadMiddleWare('image', 'image', process.env.CAMPAIGN_CATEGORY_IMAGE_PATH,'',''),
    update
)

router.route('/campaign-category/delete/:categoryId').get(deleteCategory)

router.route('/campaign-category/edit/:categoryId').get(createOrUpdateCategoryView)

router.route('/show/report').get(getReportBetween)

router.route('/show/user/:username').get(getUserByUsername)

router.route('/show/campaign/:campaignId').get(getCampaignDetail)

export default router
