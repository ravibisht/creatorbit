import { StatusCodes } from 'http-status-codes'

export default (req, res, next) => {
    res.status(StatusCodes.NOT_FOUND).json({
        statusCode: StatusCodes.NOT_FOUND,
        message: `Requested Route -> ${req.url} Not Found`,
    })
}
