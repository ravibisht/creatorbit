import { StatusCodes } from 'http-status-codes'
import { HttpException, UnAuthroziedException } from '../exception'

export default (err, req, res, next) => {
    
    if (err instanceof HttpException) {
        res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message,
        })
    }

    err = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    err = err.message || 'Internal Server Error'

    res.status(err.statusCodes).json({
        statusCode: err.statusCode,
        message: err.message,
    })
}
