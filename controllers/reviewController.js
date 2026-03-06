const review = require('./../models/reviewModel');
const AppError = require('../utils/AppError');
const factory = require('./handlerFactory');
// const catchAsync = require('../utils/catchAsync');

exports.setToursUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(review);
exports.createReview = factory.createOne(review);

exports.getReview = factory.getOne(review);

exports.updateReview = factory.updateOne(review);
exports.deleteReview = factory.deleteOne(review);
