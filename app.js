const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const AppError = require("./utils/AppError");
const CatchAsync = require("./utils/CatchAsync");
const Foodtruck = require("./models/foodtruck");
const Review = require("./models/review");

mongoose.connect("mongodb://127.0.0.1:27017/foodtruck");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "conection error"));
db.once("open", () => {
  console.log("Database Connected");
});

app.engine("ejs", engine);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("homepage");
});

app.get(
  "/foodtruck",
  CatchAsync(async (req, res) => {
    const foodtrucks = await Foodtruck.find({});
    res.render("foodtrucks/index", { foodtrucks });
  })
);

app.get("/foodtruck/new", (req, res) => {
  res.render("foodtrucks/new");
});

app.post(
  "/foodtruck",
  CatchAsync(async (req, res, next) => {
    const newFoodtruck = new Foodtruck(req.body.foodtruck);
    await newFoodtruck.save();
    res.redirect(`/foodtruck/${newFoodtruck._id}`);
  })
);

app.get(
  "/foodtruck/:id",
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const foodtruck = await Foodtruck.findById(id).populate("reviews");
    res.render("foodtrucks/show", { foodtruck });
  })
);

app.get(
  "/foodtruck/:id/edit",
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const foodtruck = await Foodtruck.findById(id);
    res.render("foodtrucks/edit", { foodtruck });
  })
);

app.put(
  "/foodtruck/:id",
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const updateFoodtruck = await Foodtruck.findByIdAndUpdate(id, {
      ...req.body.foodtruck,
    });
    res.redirect(`/foodtruck/${updateFoodtruck._id}`);
  })
);

app.delete(
  "/foodtruck/:id",
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    await Foodtruck.findByIdAndDelete(id);
    res.redirect("/foodtruck");
  })
);

app.post(
  "/foodtruck/:id/review",
  CatchAsync(async (req, res) => {
    const foodtruck = await Foodtruck.findById(req.params.id);
    const review = new Review(req.body.review);
    foodtruck.reviews.push(review);
    await review.save();
    await foodtruck.save();
    res.redirect(`/foodtruck/${foodtruck._id}`);
  })
);

app.delete(
  "/foodtruck/:id/review/:reviewId",
  CatchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Foodtruck.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/foodtruck/${id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new AppError("Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) {
    err.message = "Something Wrong";
  }
  res.status(status).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
