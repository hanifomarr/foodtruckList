const AppError = require("./utils/AppError");
const { foodtruckSchema, reviewSchema } = require("./schemas");
const Foodtruck = require("./models/foodtruck");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Please Sign In");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateFoodtruck = (req, res, next) => {
  const { error } = foodtruckSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 500);
  } else {
    next();
  }
};

module.exports.isAuhtor = async (req, res, next) => {
  const { id } = req.params;
  const foodtruck = await Foodtruck.findById(id);
  if (!foodtruck.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission");
    return res.redirect(`/foodtruck/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission");
    return res.redirect(`/foodtruck/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 500);
  } else {
    next();
  }
};
