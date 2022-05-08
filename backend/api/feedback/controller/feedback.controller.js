import { StatusCodes } from 'http-status-codes'
import { BadRequestException } from '../../../core/exception'

import { isValidString } from '../../../core/validation/validation'
import FeedbackService from '../services/feedback.service.js'

const cs = new FeedbackService()

export const feedbackView = async (req, res) => {
    res.render('user/feedback.ejs')
}

export const create = async (req,res) => {
    const {
        user: {id: userId},
        body: feedbackDetail,
    } = req

    feedbackDetail.userId = userId
    const feedbackDetailRes = await cs.create(feedbackDetail)


    res.render('user/feedback.ejs', {
        feedbackDetail: feedbackDetailRes,
        message:'FeedBack Submitted Successfully'
    })

}





export const update = async (req, res) => {
    let { accountNo, accountName, IFSCCode } = req.body

    const user = req.user

    if (!accountNo || !isValidString(accountNo, 14))
        throw new BadRequestException('Please Provide Valid Account No')

    if (!accountName || !isValidString(accountName, 3, 100))
        throw new BadRequestException('Please Provide Valid Name')

    if (!IFSCCode || !isValidString(IFSCCode, 4))
        throw new BadRequestException('Please Provide Valid IFSC Code')

    const bankAccountDetail = await cs.update({
        accountNo,
        accountName,
        IFSCCode,
    })

    if (!bankAccountDetail)
        throw new BadRequestException('Please Provide Valid Details.')

    res.json({
        statusCode: StatusCodes.OK,
        message: 'Bank Account Detail Updated',
        data: bankAccountDetail,
    })
}
