const express = require("express");
const router = express.Router();
const AppError = require("../utils/AppError");
const CatchAsync = require("../utils/CatchAsync");
const { foodtruckSchema } = require("../schemas");
const Foodtruck = require("../models/foodtruck");

const validateFoodtruck = (req, res, next) => {
  const { error } = foodtruckSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 500);
  } else {
    next();
  }
};

router.get(
  "/",
  CatchAsync(async (req, res) => {
    const foodtrucks = await Foodtruck.find({});
    res.render("foodtrucks/index", { foodtrucks });
  })
);

router.get("/new", (req, res) => {
  res.render("foodtrucks/new");
});

router.post(
  "/",
  validateFoodtruck,
  CatchAsync(async (req, res, next) => {
    const newFoodtruck = new Foodtruck(req.body.foodtruck);
    await newFoodtruck.save();
    req.flash("success", "Successfully added");
    res.redirect(`/foodtruck/${newFoodtruck._id}`);
  })
);

router.get(
  "/:id",
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const foodtruck = await Foodtruck.findById(id).populate("reviews");
    if (!foodtruck) {
      req.flash("error", "Foodtruck not found");
      return res.redirect("/foodtruck");
    }
    res.render("foodtrucks/show", { foodtruck });
  })
);

router.get(
  "/:id/edit",
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const foodtruck = await Foodtruck.findById(id);
    res.render("foodtrucks/edit", { foodtruck });
  })
);

router.put(
  "/:id",
  validateFoodtruck,
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const updateFoodtruck = await Foodtruck.findByIdAndUpdate(id, {
      ...req.body.foodtruck,
    });
    req.flash("success", "Successfully updated");
    res.redirect(`/foodtruck/${updateFoodtruck._id}`);
  })
);

router.delete(
  "/:id",
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    await Foodtruck.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted");
    res.redirect("/foodtruck");
  })
);

module.exports = router;
