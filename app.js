var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fileUpload = require("express-fileupload");
var session = require('express-session');
var bodyParser = require("body-parser");



var signup = require("./models/signup");
var student = require("./models/student");


var app = express();
app.use(fileUpload())
//DB connection
mongoose.connect(
  "mongodb://localhost:27017/Mechanical", { useNewUrlParser: true, useUnifiedTopology: true },
  function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("DataBase Connected Successfully");
    }
  }
);

app.use(
  session({
      secret: "session",
      resave: false,
      saveUninitialized: true
  })
);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "500mb" })); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" })); // parse application/x-www-form-urlencoded
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
