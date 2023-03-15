const HttpStatus = require('http-status-codes')

// const {InternalError} = require('./internal.error')
class ClientError extends Error {
  constructor(message, code = HttpStatus.INTERNAL_SERVER_ERROR) {
    super();
    this.message = message;
    this.code = code
  }
}

module.exports = {ClientError}