import {StatusCodes} from 'http-status-codes'
import {BadRequestException, NotFoundException} from '../../../core/exception'

import {isValidId} from "../../../core/validation/validation";
import CampaignApplicationService from "../services/CampaignApplicationService.js";
import ApplicationStatus from "../enums/ApplicationStatus.js";
import PaymentStatus from "../enums/PaymentStatus.js";

const cs = new CampaignApplicationService()

export const create = async (req, res) => {

    const {campaignId} = req.body
    const {id: userId} = req.user

    if (!isValidId(campaignId)) throw new BadRequestException('Please Provide Campaign Category Id')

    const campaignApplication = await cs.create({
            campaignId: Number(campaignId),
            userId
        }
    )

    if (!campaignApplication) throw new BadRequestException('Please Provide Valid Details')

    req.flash({
        message: "Logout Successfully.",
        statusCode: StatusCodes.OK
    })

    res.redirect('campaign-application').json({
        statusCode: StatusCodes.CREATED,
        message: 'Campaign Application Created',
        data: campaignApplication,
    })
}


export const update = async (req, res) => {

    const {applicationStatus, paymentStatus} = req.body

    const {id: userId} = req.user

    let {campaignApplicationId} = req.params

    if (!isValidId(campaignApplicationId)) throw new BadRequestException('Please Provide Campaign Application Id')

    if (applicationStatus && !ApplicationStatus.values().includes(ApplicationStatus.valueOf(applicationStatus)?.toString()))
        throw new BadRequestException('Please Provides Valid Application Status')

    if (paymentStatus && !PaymentStatus.values().includes(PaymentStatus.valueOf(paymentStatus)?.toString()))
        throw new BadRequestException('Please Provides Valid Payment Status')

    const campaign = await cs.findById(Number(campaignApplicationId))

    if (!campaign) throw new BadRequestException('Please Provide Valid Campaign Application Id')

    const campaignApplication = await cs.update({
            id: Number(campaignApplicationId),
            campaignId: campaign.campaignId,
            userId,
            applicationStatus,
            paymentStatus
        }
    )

    if (!campaignApplication) throw new BadRequestException('Please Provide Valid Details')

    req.flash({
        message: 'Campaign Application Updated',
        statusCode: StatusCodes.OK,
    })

    res.redirect('/campaign-application/manage')
}


export const deleteById = async (req, res) => {

    let {campaignApplicationId: id} = req.params
    const userId = req.user.id

    if (!isValidId(id)) throw new BadRequestException('Please Provide Valid Id')
    id = Number(id)

    const campaignApplication = await cs.deleteById(id, userId)

    res.json({
        statusCode: StatusCodes.OK, message: 'Deleted Successfully', data: campaign
    })
}


export const findById = async (req, res) => {

    let {campaignId: id} = req.params
    if (!isValidId(id)) throw new BadRequestException('Please Provide Valid Id')
    id = Number(id)

    const campaignApplication = await cs.findById(id)

    if (!campaignApplication) throw new NotFoundException(`Campaign Application Not Found With Id : ${id}`)

    res.json({
        statusCode: StatusCodes.OK,
        message: 'Campaign Application Details',
        data: campaignApplication
    })
}


export const getCampaignApplicationByUser = async (req, res) => {

    const userId = req.user.id

    const {applicationStatus, paymentStatus} = req.query

    if (applicationStatus && !ApplicationStatus.values().includes(ApplicationStatus.valueOf(applicationStatus)?.toString()))
        throw new BadRequestException('Please Provides Valid Application Status')

    if (paymentStatus && !PaymentStatus.values().includes(PaymentStatus.valueOf(paymentStatus)?.toString()))
        throw new BadRequestException('Please Provides Valid Application Status')

    const campaignApplication = await cs.getCampaignByUserId(userId, applicationStatus, paymentStatus)


    res.render('user/my-campaigns.ejs', {
        statusCode: StatusCodes.OK,
        message: "All Campaign Application",
        data: campaignApplication
    })
}


export const getCampaignApplicationByOwner = async (req, res) => {

    const userId = req.user.id

    const {applicationStatus, paymentStatus} = req.query

    if (applicationStatus && !ApplicationStatus.values().includes(ApplicationStatus.valueOf(applicationStatus)?.toString()))
        throw new BadRequestException('Please Provides Valid Application Status')

    if (paymentStatus && !PaymentStatus.values().includes(PaymentStatus.valueOf(paymentStatus)?.toString()))
        throw new BadRequestException('Please Provides Valid Application Status')

    const campaignApplication = await cs.getCampaignByOwnerId(userId, applicationStatus, paymentStatus)


    res.render('user/campaign-application-requests.ejs', {
        statusCode: StatusCodes.OK,
        message: "All Campaign Application",
        data: campaignApplication
    })
}



