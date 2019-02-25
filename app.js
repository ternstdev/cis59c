var createError = require('http-errors');
var subdomain = require('express-subdomain');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();


const fs = require('fs');

const customlogger = (req, res, next) => {
  fs.appendFile('log.txt', `${req.protocol}://${req.get('host')}${req.originalUrl}\n`, function (err) {
    if (err) {
      console.log("failed");
      res.send(`Uhh fail.  --  ${req.protocol}://${req.get('host')}${req.originalUrl}\n`);
    } else {
      console.log("success!");
      res.send(`Uhh success?  --  ${req.protocol}://${req.get('host')}${req.originalUrl}\n`);
      //next();
    }
  });
};

//const customlogger = require('./middleware/customlogger');
app.use(customlogger);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(subdomain('api', apiRouter));
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
