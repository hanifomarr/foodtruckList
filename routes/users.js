const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registerUser = await User.register(user, password);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Succefully register");
        res.redirect("/");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    keepSessionInfo: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Succefully register");
    const loginRedirect = req.session.returnTo || "/foodtruck";
    delete req.session.returnTo;
    res.redirect(loginRedirect);
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Succefully logout");
    res.redirect("/login");
  });
});

module.exports = router;
