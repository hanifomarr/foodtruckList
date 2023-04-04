const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const AppError = require("./utils/AppError");
const foodtruckRouter = require("./routes/foodtrucks");
const reviewRouter = require("./routes/reviews");

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

app.use("/foodtruck", foodtruckRouter);
app.use("/foodtruck/:id/review", reviewRouter);

app.get("/", (req, res) => {
  res.render("homepage");
});

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
