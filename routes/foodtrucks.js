const express = require("express");
const router = express.Router();
const CatchAsync = require("../utils/CatchAsync");
const { isLoggedIn, isAuhtor, validateFoodtruck } = require("../middleware");
const foodtrucks = require("../controllers/foodtrucks");

router.get("/", CatchAsync(foodtrucks.index));

router.get("/new", isLoggedIn, foodtrucks.createFormFoodtruck);

router.post(
  "/",
  isLoggedIn,
  validateFoodtruck,
  CatchAsync(foodtrucks.createFoodtruck)
);

router.get("/:id", CatchAsync(foodtrucks.getFoodtruck));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuhtor,
  CatchAsync(foodtrucks.showEditFoodtruck)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuhtor,
  validateFoodtruck,
  CatchAsync(foodtrucks.editFoodtruck)
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuhtor,
  CatchAsync(foodtrucks.deleteFoodtrucks)
);

module.exports = router;
