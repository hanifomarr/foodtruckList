const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const passport = require("passport");

router.get("/register", users.viewRegisterForm);

router.post("/register", users.createUser);

router.get("/login", users.viewLoginForm);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    keepSessionInfo: true,
    failureRedirect: "/login",
  }),
  users.loginUser
);

router.get("/logout", users.logout);

module.exports = router;
