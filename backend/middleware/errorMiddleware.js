const AppError = require('../utils/errorHandler');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : '';
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Specific error handling
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') error = handleCastErrorDB(err);
  
  // Mongoose duplicate key
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

  // Not Found error
  if (err.name === 'NotFoundError') {
    error.statusCode = 404;
    error.message = err.message || 'Resource not found';
  }

  // Development vs Production error response
  if (process.env.NODE_ENV === 'development') {
    res.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: err.stack
    });
  } else {
    // Production: don't leak error details
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
  }
};

module.exports = errorHandler;
