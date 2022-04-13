import { StatusCodes } from "http-status-codes";
import HttpException from "./HttpException";

export default class NotFoundException extends HttpException {
  constructor(message) {
    super(StatusCodes.BAD_REQUEST, message);
  }
}
