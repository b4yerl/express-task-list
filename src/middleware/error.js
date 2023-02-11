const ErrorResponse = require('../utils/ErrorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for dev
  console.log(err.stack.red);

  // Mongoose Cast Error
  if(err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Duplicate fields error, checking by code
  if(err.statusCode === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if(err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(singleErr => singleErr.message);
    error = new ErrorResponse(message, 400);
  }

  // Send back detcted error or the default 500 case
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;