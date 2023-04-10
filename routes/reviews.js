const express = require("express");
const router = express.Router({ mergeParams: true });

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const CatchAsync = require("../utils/CatchAsync");
const reviews = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, CatchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  CatchAsync(reviews.deleteReview)
);

module.exports = router;
