const logger = require("../helpers/logger");

class AppError extends Error {

  constructor(message, statusCode, isOperational = true) {
    super(message);
    
    this.message = message;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}


const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error('Error occurred:', {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.userId
  });

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  } else {
    if (err.isOperational) {
      console.error('ERROR', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
      })
    } else {
      logger.error('CRITICAL ERROR', {
        error: err,
        stack: err.stack
      });
      
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
      });
    }
  }
};

module.exports = { AppError, errorHandler };