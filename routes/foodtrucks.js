const express = require("express");
const router = express.Router();
const CatchAsync = require("../utils/CatchAsync");
const { isLoggedIn, isAuhtor, validateFoodtruck } = require("../middleware");
const foodtrucks = require("../controllers/foodtrucks");

router
  .route("/")
  .get(CatchAsync(foodtrucks.index))
  .post(isLoggedIn, validateFoodtruck, CatchAsync(foodtrucks.createFoodtruck));

router.get("/new", isLoggedIn, foodtrucks.createFormFoodtruck);

router
  .route("/:id")
  .get(CatchAsync(foodtrucks.getFoodtruck))
  .put(
    isLoggedIn,
    isAuhtor,
    validateFoodtruck,
    CatchAsync(foodtrucks.editFoodtruck)
  )
  .delete(isLoggedIn, isAuhtor, CatchAsync(foodtrucks.deleteFoodtrucks));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuhtor,
  CatchAsync(foodtrucks.showEditFoodtruck)
);

module.exports = router;
