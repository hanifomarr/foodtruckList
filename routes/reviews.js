const express = require("express");
const router = express.Router({ mergeParams: true });
const AppError = require("../utils/AppError");
const CatchAsync = require("../utils/CatchAsync");
const Foodtruck = require("../models/foodtruck");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 500);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  CatchAsync(async (req, res) => {
    const foodtruck = await Foodtruck.findById(req.params.id);
    const review = new Review(req.body.review);
    foodtruck.reviews.push(review);
    await review.save();
    await foodtruck.save();
    res.redirect(`/foodtruck/${foodtruck._id}`);
  })
);

router.delete(
  "/:reviewId",
  CatchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Foodtruck.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/foodtruck/${id}`);
  })
);

module.exports = router;
