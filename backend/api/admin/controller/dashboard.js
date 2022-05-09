import UserService from "../../auth/services/userServices.js";
import CampaignService from "../../campagin/services/CampaignService.js";
import FeedbackService from "../../feedback/services/feedback.service.js";
import CampaignApplicationService from "../../campagin/services/CampaignApplicationService.js";
import CampaignCategory from "../../campagin/services/CampaignCategory.js";

import moment from "moment";
import {StatusCodes} from "http-status-codes";
import {BadRequestException, NotFoundException} from "../../../core/exception/index.js";
import {isValidId} from "../../../core/validation/validation.js";

const userService = new UserService()
const campaignService = new CampaignService()
const categoryService = new CampaignCategory()
const feedbackService = new FeedbackService()
const campaignApplicationService = new CampaignApplicationService()


export const dashboardView = async (req, res) => {

    const totalUsers = await userService.getAllUserCount()
    const totalCampaigns = await campaignService.getCampaignCount()
    const totalCategories = await categoryService.getCategoryCount()
    const totalFeedbacks = await feedbackService.getAllFeedbackCount()
    const totalCampaignApplication = await campaignApplicationService.getAllCampaignApplicationCount()

    res.render('admin/admin-dashboard.ejs', {
        totalUsers,
        totalCampaigns,
        totalCategories,
        totalFeedbacks,
        totalCampaignApplication,
    })

}


export const getAllUsersView = async (req, res) => {
    const users = await userService.getAllUsers()
    res.render('admin/dashboard-show-users.ejs', {
        users
    })
}


export const getAllCampaignView = async (req, res) => {
    const campaigns = await campaignService.getAllCampaign()
    res.render('admin/dashboard-show-campaign.ejs', {
        campaigns,
        moment
    })
}


export const getAllCampaignCategoryView = async (req, res) => {
    const categories = await categoryService.getAllCategory()
    res.render('admin/dashboard-campaign-categories.ejs', {
        categories,

    })
}


export const getAllFeedbackView = async (req, res) => {
    const feedbacks = await feedbackService.getAllFeedback()
    res.render('admin/dashboard-feedback.ejs', {
        feedbacks,
        moment
    })
}

export const getAllCampaignView1 = async (req, res) => {
    const users = await campaignService.getAllCampaign()
    res.render('admin/dashboard-show-users.ejs', {
        users
    })
}

export const showReportView = async (req, res) => {

    res.render('admin/dashboard-report.ejs')
}


export const getReportBetween = async (req, res) => {

    const {reportType, fromDate, toDate} = req.query

    switch (reportType) {
        case 'user_sign_up_report':
            const users = await userService.getUserBetween(fromDate, toDate)
            res.render('admin/dashboard-user-signup-report.ejs', {
                users,
                moment
            })
            break;

        case 'campaign_report':
            const campaigns = await campaignService.getCampaignBetween(fromDate, toDate)
            res.render('admin/dashboard-campaign-report.ejs', {
                campaigns,
                moment
            })
            break;
        case 'feedback_report':
            const feedbacks = await feedbackService.getFeedbackBetween(fromDate, toDate)
            res.render('admin/dashboard-feedback-report.ejs', {
                feedbacks,
                moment
            })
            break;

    }

}

export const createOrUpdateCategoryView = async (req, res)=>{
    const {categoryId} = req.params
    if (categoryId){
        const category = await categoryService.getCategory(categoryId)
        res.render('admin/dashboard-edit-category.ejs',{
            category
        })
    }else{
        res.render('admin/dashboard-add-category.ejs')
    }
}



export const getUserByUsername = async (req, res) => {

    const {username} = req.params

    if (!username) throw new NotFoundException(`User Not Found`)

    const user = await userService.findByUsername(username)

    if (!user) throw new NotFoundException(`User Not Found With Username : ${username}`,)


    res.render('admin/dashboard-user-profile.ejs', {
        statusCode: StatusCodes.OK,
        message: 'User Detail',
        user,
    })
}



export const getCampaignDetail = async (req, res) => {

    let { campaignId: id } = req.params
    if (!isValidId(id)) throw new BadRequestException('Please Provide Valid Id')
    id = Number(id)

    const campaign = await campaignService.findById(id)
    console.log(campaign)

    if (!campaign)
        throw new NotFoundException(`Campaign Not Found With Id : ${id}`)



    res.render('admin/dashboard-campaign-detail.ejs', {
        statusCode: StatusCodes.OK,
        message: 'Campaign Details',
        campaign,
        moment,
    })
}



export const getCategoryView = async (req, res) => {

    const {categoryId} = req.params

    if (categoryId){
        const category = await ccs.getCategory(categoryId)
    }

    res.render('admin/dashboard-edit-category.ejs', {
        statusCode: StatusCodes.OK,
        category,
        moment,
        message: 'Category  Detail',
    })
}
