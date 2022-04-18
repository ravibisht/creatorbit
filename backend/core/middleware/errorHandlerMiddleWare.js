import { StatusCodes } from 'http-status-codes'
import { HttpException, UnAuthroziedException } from '../exception'

export default (err, req, res, next) => {
    if (err instanceof HttpException) {
        res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message,
        })

        return
    }

    err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    err.message = err.message || 'Internal Server Error'

    res.status(err.statusCode).json({
        statusCode: err.statusCode,
        message: err.message,
    })
}
