const Joi = require("joi");

module.exports.foodtruckSchema = Joi.object({
  foodtruck: Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    img: Joi.string().required(),
    desc: Joi.string().required(),
    price: Joi.number().required().min(0),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});
