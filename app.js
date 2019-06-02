var createError = require('http-errors');
var subdomain = require('express-subdomain');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

// Testing logger.
//var fs = require('fs')
// create a write stream (in append mode)
//var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// setup the logger
// End testing logger.

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('json replacer', function(key, value) {
  // undefined values are set to `null`
  if (typeof value === "undefined") {
    return "undefined";
  }
  return value;
});

//app.use(logger('combined', { stream: accessLogStream }))
app.use(logger(':date[iso] :method :url :status :response-time ms - :res[content-length]'));
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: 5120 }));
app.use(cookieParser());
app.use(subdomain('api', apiRouter));
app.use('/api', apiRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
/**
 * 
 * @param { import('http-errors').HttpError } err
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 * @param { import('express').NextFunction } next
 */
var errorHandler = function(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  if (err.status && err.status === 415)
  {
    return res.status(415).json({ msg: err.message, isSuccess: false });
  }
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
}

app.use(errorHandler);

module.exports = app;
