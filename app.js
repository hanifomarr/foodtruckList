const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const AppError = require("./utils/AppError");
const foodtruckRouter = require("./routes/foodtrucks");
const reviewRouter = require("./routes/reviews");
const User = require("./models/user");

mongoose.connect("mongodb://127.0.0.1:27017/foodtruck");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "conection error"));
db.once("open", () => {
  console.log("Database Connected");
});

const sessionConfig = {
  secret: "somethingSecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.engine("ejs", engine);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/fakeuser", async (req, res) => {
  const user = new User({ email: "hanif@gmail.com", username: "semann" });
  const newUser = await User.register(user, "monkey");
  res.send(newUser);
});

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
