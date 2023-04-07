const express = require("express");
const router = express.Router();
const CatchAsync = require("../utils/CatchAsync");
const Foodtruck = require("../models/foodtruck");
const { isLoggedIn, isAuhtor, validateFoodtruck } = require("../middleware");
const AppError = require("../utils/AppError");
const { foodtruckSchema } = require("../schemas");

router.get(
  "/",
  CatchAsync(async (req, res) => {
    const foodtrucks = await Foodtruck.find({});
    res.render("foodtrucks/index", { foodtrucks });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("foodtrucks/new");
});

router.post(
  "/",
  isLoggedIn,
  validateFoodtruck,
  CatchAsync(async (req, res, next) => {
    const newFoodtruck = new Foodtruck(req.body.foodtruck);
    newFoodtruck.author = req.user._id;
    await newFoodtruck.save();
    req.flash("success", "Successfully added");
    res.redirect(`/foodtruck/${newFoodtruck._id}`);
  })
);

router.get(
  "/:id",
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const foodtruck = await Foodtruck.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    if (!foodtruck) {
      req.flash("error", "Foodtruck not found");
      return res.redirect("/foodtruck");
    }
    res.render("foodtrucks/show", { foodtruck });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuhtor,
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const foodtruck = await Foodtruck.findById(id);
    if (!foodtruck) {
      req.flash("error", "Foodtruck Not found");
      return res.redirect(`/foodtruck`);
    }
    res.render("foodtrucks/edit", { foodtruck });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuhtor,
  validateFoodtruck,
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const updateFoodtruck = await Foodtruck.findByIdAndUpdate(id, {
      ...req.body.foodtruck,
    });
    req.flash("success", "Successfully updated");
    res.redirect(`/foodtruck/${id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuhtor,
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    await Foodtruck.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted");
    res.redirect("/foodtruck");
  })
);

module.exports = router;
