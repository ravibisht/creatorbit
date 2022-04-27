import { StatusCodes } from 'http-status-codes'
import HttpException from './HttpException'

export default class ForbiddenException extends HttpException {
    constructor(message) {
        super(StatusCodes.FORBIDDEN,message)
    }
}
