module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Please Sign In");
    return res.redirect("/login");
  }
  next();
};
