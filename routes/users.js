const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const passport = require("passport");

router.route("/register").get(users.viewRegisterForm).post(users.createUser);

router
  .route("/login")
  .get(users.viewLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      keepSessionInfo: true,
      failureRedirect: "/login",
    }),
    users.loginUser
  );

router.get("/logout", users.logout);

module.exports = router;
