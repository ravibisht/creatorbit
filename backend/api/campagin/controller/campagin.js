import {StatusCodes} from 'http-status-codes'
import {BadRequestException, NotFoundException} from '../../../core/exception'
import moment from 'moment'

import {isValidEndDate, isValidId, isValidStartDate, isValidString,} from '../../../core/validation/validation'
import CampaignService from '../services/CampaignService'
import APIFeature from '../../../core/services/APIFeature'
import CampaignCategory from "../services/CampaignCategory.js";

const cs = new CampaignService()
const categoryService = new CampaignCategory()


export const createCampaignView = async (req, res) => {

    const campaignCategories = await categoryService.getAllCategory()
    res.render('user/create-campaign.ejs', {
        campaignCategories
    })
}


export const create = async (req, res) => {

    const {body: campaignParam, user} = req

    if (!isValidId(campaignParam.campaignCategoryId))
        throw new BadRequestException('Please Provide Campaign Category Id')

    if (!campaignParam.name || !isValidString(campaignParam.name, 3, 100))
        throw new BadRequestException('Please Provide Valid Name')

    if (!campaignParam.shortDesc || !isValidString(campaignParam.shortDesc))
        throw new BadRequestException('Please Provide Valid Short Description')

    if (!campaignParam.description || !isValidString(campaignParam.description))
        throw new BadRequestException('Please Provide Valid Description')

    if (!isValidStartDate(campaignParam.startDate, new Date()))
        throw new BadRequestException('Please Provide Valid Start Date')

    if (!isValidEndDate(campaignParam.startDate, campaignParam.endDate))
        throw new BadRequestException('Please Provide Valid End Date')

    campaignParam.startDate = new Date(campaignParam.startDate)
    campaignParam.endDate = new Date(campaignParam.endDate)
    campaignParam.userId = user.id
    campaignParam.campaignCategoryId = Number(campaignParam.campaignCategoryId)

    const campaign = await cs.create(campaignParam)

    if (!campaign) throw new BadRequestException('Please Provide Valid Details')


    res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: 'Campaign Created',
        data: campaign,
    })
}


export const update = async (req, res) => {

    let {name, shortDesc, description, startDate, endDate, image, video} =
        req.body

    let {campaignId: id} = req.params

    const user = req.user

    if (!isValidId(id))
        throw new BadRequestException('Please Provide Valid Campaign Id')

    if (!name || !isValidString(name, 3, 100))
        throw new BadRequestException('Please Provide Valid Name')

    if (!shortDesc || !isValidString(shortDesc))
        throw new BadRequestException('Please Provide Valid Short Description')

    if (!description || !isValidString(description))
        throw new BadRequestException('Please Provide Valid Description')

    if (!isValidStartDate(startDate, new Date()))
        throw new BadRequestException('Please Provide Valid Start Date')

    if (!isValidEndDate(startDate, endDate))
        throw new BadRequestException('Please Provide Valid End Date')

    startDate = new Date(startDate)
    endDate = new Date(endDate)
    const userId = user.id
    id = Number(id)

    const campaign = await cs.update({
        id,
        userId,
        name,
        shortDesc,
        description,
        startDate,
        endDate,
        image,
        video,
    })

    if (!campaign)
        throw new BadRequestException('Please Provide Valid Details.')

    res.json({
        statusCode: StatusCodes.OK,
        message: 'Campaign Updated',
        data: campaign,
    })
}


export const deleteById = async (req, res) => {

    let {campaignId: id} = req.params
    const userId = req.user.id
    if (!isValidId(id)) throw new BadRequestException('Please Provide Valid Id')
    id = Number(id)
    const campaign = await cs.deleteById(id, userId)

    res.json({
        statusCode: StatusCodes.OK,
        message: 'Deleted Successfully',
        data: campaign,
    })
}


export const getCampaignByID = async (req, res) => {

    let { campaignId: id } = req.params
    if (!isValidId(id)) throw new BadRequestException('Please Provide Valid Id')
    id = Number(id)

    const campaign = await cs.findById(id)
    console.log(campaign)

    if (!campaign)
        throw new NotFoundException(`Campaign Not Found With Id : ${id}`)

    let campaignDetailView = null

    if (req.user.role === 'BRAND') {
        campaignDetailView ='user/campaign-application-detail-brand.ejs'
    } else {
        campaignDetailView = 'user/campaign-detail.ejs'
    }

    res.render(campaignDetailView, {
        statusCode: StatusCodes.OK,
        message: 'Campaign Details',
        campaign,
        moment,
    })
}


export const getAllCampaign = async (req, res) => {

    const campaigins = await cs.getAllCampaign(
        new APIFeature(req.query).paginate().build(),
    )

    const categories = await categoryService.getAllCategory()

    res.render('user/index', {
        statusCode: StatusCodes.OK,
        message: 'All Campaigns',
        data: {
            campaigins,
            categories
        },
        moment,
    })
}


export const getBrandCampaignView = async (req, res) => {
    const campaigns = await cs.getCampaignByUserId(req.user.id)

    res.render('user/my-created-campaigns.ejs', {
        campaigns,
        moment
    })
}