// import {logger} from '../config/winston';

const HttpStatus = require('http-status-codes');
const {ClientError, InternalError} = require('../errors');

const handleSuccess = (res, data, message, code = HttpStatus.OK) => {

  return res.status(code).json({
    code: HttpStatus.OK,
    data: data,
    message: message
  });
}

// handle return response to the user
const handleError = (res, error) => {
  // logger.error(error);
  console.log('errorne', error)
  if (error instanceof ClientError) {
    return res.status(HttpStatus.NOT_FOUND).json({
      code: error.code,
      message: error.message
    })
  }
  if (error instanceof InternalError) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: error.code,
      message: error.message
    })
  }
  if (error instanceof Error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message

    })
  }
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    message: error.message
  })
}

module.exports = {handleSuccess, handleError}
