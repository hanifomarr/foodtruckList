const express = require("express");
const router = express.Router({ mergeParams: true });

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const CatchAsync = require("../utils/CatchAsync");
const Foodtruck = require("../models/foodtruck");
const Review = require("../models/review");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  CatchAsync(async (req, res) => {
    const foodtruck = await Foodtruck.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    foodtruck.reviews.push(review);
    await review.save();
    await foodtruck.save();
    res.redirect(`/foodtruck/${foodtruck._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  CatchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Foodtruck.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/foodtruck/${id}`);
  })
);

module.exports = router;
