// const AppError = require('./../utils/appError');
const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} ${err.value}.`;
  return new AppError(message, 404);
};
const handleDuplicateFiledsDB = (err) => {
  const value = Object.values(err.keyValue)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handlValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `invalid input data.${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handlJWTError = (err) =>
  new AppError('Invalid token please login again', 401);

const handlJWTExpiredError = (err) =>
  new AppError('Your token has expired please login again', 401);

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  // B) Rendered Website
  console.error('ERROR💥', err);

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) Api
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    console.log(err);

    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programing or other unknown error: don't leak error details
    // 1) log error
    console.error('ERROR💥', err);

    // 2) Send general message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
  // B) Rendered Website
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // B) Programing or other unknown error: don't leak error details
  // 1) log error
  console.error('ERROR💥', err);

  // 2) Send general message
  res.status(500).json({
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFiledsDB(error);
    if (error.name === 'ValidationError') error = handlValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handlJWTError(error);
    if (error.name === 'TokenExpiredError') error = handlJWTExpiredError(error);

    sendErrorProd(error, req, res);
  }
};
