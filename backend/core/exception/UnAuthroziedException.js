import { StatusCodes } from 'http-status-codes'
import HttpException from './HttpException'
export default class UnAuthroziedException extends HttpException {
    constructor(message) {
        super(StatusCodes.UNAUTHORIZED ,message, )
    }
}
