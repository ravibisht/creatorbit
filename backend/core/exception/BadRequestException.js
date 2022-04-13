import { StatusCodes } from 'http-status-codes'
import HttpException from './HttpException'
/**
 * This Class For Http Bad Request Status Code.It internally Uses @ali StatusCodes.BAD_REQUEST
 * @param
 */
export default class BadRequestException extends HttpException {
    constructor(message) {
        super(StatusCodes.BAD_REQUEST, message)
    }
}
