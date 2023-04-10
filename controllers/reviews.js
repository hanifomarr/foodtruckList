const Foodtruck = require("../models/foodtruck");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const foodtruck = await Foodtruck.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  foodtruck.reviews.push(review);
  await review.save();
  await foodtruck.save();
  res.redirect(`/foodtruck/${foodtruck._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Foodtruck.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/foodtruck/${id}`);
};
