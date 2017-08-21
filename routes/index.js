const mongoose = require("mongoose");
const {User} = require("../models");
const router = require("express").Router();
const passport = require("passport");


// Import the middleware
const {loggedInOnly, loggedOutOnly} = require("../middleware");

router.get("/login", loggedInOnly, (req, res) => {
  res.render("login")
})

router.get("/register", loggedInOnly, (req, res) => {
  res.render("register")
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}))

router.post("/register", async(req, res, next) => {
  const {username, password} = req.body;
  const user = new User({username, password});

  try {
    await user.save();
    req.login(user, err => {
      if(err) next(err);
      else res.redirect("/");
    })
  } catch (err) {
    return next(err);
  }
});

router.get('/logout', loggedOutOnly, function(req, res) {
  req.logout();
  res.redirect("/");
})

// set up router for handling other stuff
router.get("/", (req, res) => {
  return req.user
    ? res.render("landing", {user: req.user})
    : res.redirect("/login")
})

module.exports = router;
