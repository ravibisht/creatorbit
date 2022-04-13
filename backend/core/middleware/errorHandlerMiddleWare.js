import { StatusCodes } from 'http-status-codes'
import { HttpException, UnAuthroziedException } from '../exception'

export default (err, req, res, next) => {
    if (err instanceof HttpException) {
        res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message,
        })
    }

    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Internal Server Error',
    }

    if (customError.code === 'JsonWebTokenError') {
        customError = new UnAuthroziedException(`Please Provide Valid Token`)
    }

    res.status(err.statusCodes).json({
        statusCode: err.statusCode,
        message: err.message,
    })
}
