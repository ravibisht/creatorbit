import {StatusCodes} from 'http-status-codes'
import PaymentService from '../services/payment.service.js'

const cs = new PaymentService()

export const bankDetailView = async (req, res) => {

    const {
        user: {id: userId},
    } = req

    let bankDetailRes = await cs.findByUserId(userId)

    res.render('user/bank-account.ejs', {
        bankDetail: bankDetailRes
    })

}

export const createOrUpdate = async (req, res) => {
    const {
        user: {id: userId},
        body: bankDetail,
    } = req

    let bankDetailRes = null
    bankDetail.userId = userId

    if (bankDetail.id) {
        bankDetail.id = Number(bankDetail.id)
        bankDetailRes = await cs.update({...bankDetail, userId})
    } else {
        delete bankDetail.id
        bankDetailRes = await cs.create(bankDetail)
    }


    req.flash('messageInfo', {
        message: "Bank Account Detail Saved Successfully",
        statusCode: StatusCodes.OK
    })

    res.render('user/bank-account.ejs', {
        bankDetail: bankDetailRes
    })

}





