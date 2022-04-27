import {StatusCodes} from 'http-status-codes'
import {HttpException} from '../exception'
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";

export default (err, req, res, next) => {

    console.log(err)

    if (err instanceof HttpException) {
        res.status(err.statusCode).json({
            statusCode: err.statusCode, message: err.message,
        })
        return
    }

    if (err instanceof PrismaClientKnownRequestError) {

        res.status(StatusCodes.BAD_REQUEST).json({
            statusCode: StatusCodes.BAD_REQUEST, message: err.meta.cause || 'Resource Not Found'
        })
        return
    }


    err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    err.message = err.message || 'Internal Server Error'

    res.status(err.statusCode).json({
        statusCode: err.statusCode, message: err.message,
    })
}
