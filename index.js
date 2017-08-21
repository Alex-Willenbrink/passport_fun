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
// const {User} = require("./models");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/passport_practice");
const Promise = require("bluebird");

// Set up local strategy
const {local, serializeUser, deserializeUser} = require("./strategies");
passport.use(local);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);


// Attach the index route
const indexRoutes = require("./routes/index");
app.use("/", indexRoutes);

// Set the server to start listening for requests
const port = 3000;
app.listen(port, () => console.log(`I'm listening on port ${port}, my broski!`));
