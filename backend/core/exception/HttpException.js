/**
 * @class HttpException Base  Class For All Error or Exception thought the Controller.
 * @param statusCode for HttpStatus Code.
 * @param message for message the will sent to client.
 */
export default class HttpException extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}
