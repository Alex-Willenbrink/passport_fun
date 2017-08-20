// Set up express
const express = require("express");
const app = express();

// Set up cookieParser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Set up bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// Set up express session
const expressSession = require("express-session");
app.use(expressSession({secret: "keyboard cat", saveUninitialized: false, resave: false}))

// Set up flash messages
const flash = require("express-flash");
app.use(flash());

// Set up express handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: 'application'}));
app.set("view engine", "handlebars");

// Set up public folder for styling and front end javascript
const path = require("path");
app.use(express.static(path.join(__dirname, 'public')));

// Set up passport and local strategy
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

// Set up mongoose
const {User} = require("./models");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/passport_practice");
const Promise = require("bluebird");

// Set up local strategy
const {local, serializeUser, deserializeUser} = require("./strategies");
passport.use(local);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

// set up router for handling other stuff
app.get("/", (req, res) => {
  return req.user
    ? res.render("landing", {user: req.user})
    : res.redirect("/login")
})

// Import the middleware
const {loggedInOnly, loggedOutOnly} = require("./middleware");

app.get("/login", loggedInOnly, (req, res) => {
  res.render("login")
})

app.get("/register", loggedInOnly, (req, res) => {
  res.render("register")
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}))

app.post("/register", async(req, res, next) => {
  const {username, password} = req.body;
  const user = new User({username, password});
  console.log(user);

  try {
    await user.save();
    // res.locals.user = user;
    // console.log(user);
    return res.redirect("/");
  } catch (err) {
    return next(err);
  }
});

app.get('/logout', loggedOutOnly, function(req, res) {
  req.logout();
  res.redirect("/");
})


// Set the server to start listening for requests
const port = 3000;
app.listen(port, () => console.log(`I'm listening on port ${port}, my broski!`));
