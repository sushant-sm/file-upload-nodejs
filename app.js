const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const User = require("./models/user");
const File = require("./models/file");
const upload = require("express-fileupload");

//---------DATABASE SETUP------------------
const mongo_uri = process.env.mongo_uri;

const connect = mongoose.connect(mongo_uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connect.then(
  (db) => {
    console.log("Database Connected Successfully");
  },
  (err) => {
    console.log("Error occur while connecting ", err);
  }
);

//-------------GENRAL CONFIGURATION----------
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");
//-------------------------------------------

//------------PASSPORT CONFIGURATION-----------
app.use(
    require("express-session")({
      secret: "Sushant M",
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  
  //to get current logged in user
  app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
  });
//------------------------------------------------


//------------PORT SETUP-----------

let port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log(`Server Listening at http://localhost:${port}`);
});

//------------------------------------------------


//------------ROUTES-----------
const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/user");
const fileUploadRoutes = require("./routes/file");

app.use(upload());
app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/files", fileUploadRoutes);
//------------------------------------------------