const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const Foodtruck = require("./models/foodtruck");
const AppError = require("./utils/AppError");
const CatchAsync = require("./utils/CatchAsync");

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

app.get("/foodtruck", async (req, res) => {
  const foodtrucks = await Foodtruck.find({});
  res.render("foodtrucks/index", { foodtrucks });
});

app.get("/foodtruck/new", async (req, res) => {
  res.render("foodtrucks/new");
});

app.post("/foodtruck", (req, res) => {
  const newFoodtruck = new Foodtruck(req.body.foodtruck);
  newFoodtruck.save();
  res.redirect(`/foodtruck/${newFoodtruck._id}`);
});

app.get("/foodtruck/:id", async (req, res) => {
  const { id } = req.params;
  const foodtruck = await Foodtruck.findById(id);
  res.render("foodtrucks/show", { foodtruck });
});

app.get("/foodtruck/:id/edit", async (req, res) => {
  const { id } = req.params;
  const foodtruck = await Foodtruck.findById(id);
  res.render("foodtrucks/edit", { foodtruck });
});

app.put("/foodtruck/:id", async (req, res) => {
  const { id } = req.params;
  const updateFoodtruck = await Foodtruck.findByIdAndUpdate(id, {
    ...req.body.foodtruck,
  });
  res.redirect(`/foodtruck/${updateFoodtruck._id}`);
});

app.delete("/foodtruck/:id", async (req, res) => {
  const { id } = req.params;
  await Foodtruck.findByIdAndDelete(id);
  res.redirect("/foodtruck");
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
