const createError = require('http-errors');
const express = require('express');
const expressValidator = require('express-validator');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const cors = require('cors');

var session = require('express-session');
var flash = require('connect-flash');

// Require MongoDB Database
require('./db');

const indexRouter = require('./routes/index.router');
// const signupRouter = require('./routes/signup.router');
// const userRouter = require('./routes/users.router');
// const yardsaleRouter = require('./routes/yardsales.router');
//const favoriteRouter = require('./routes/favorites.router');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// used to display the json in pretty print format
app.set('json spaces', 2);

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// enable Cross-Origin Resource Sharing (CORS)
// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
//   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
//   next();
// });

app.use('/', indexRouter);
// app.use('/users', userRouter);
// app.use('/signup', signupRouter);
// app.use('/post_yardsale', yardsaleRouter);
// app.use('/favorites', favoriteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err)
// });

// error handler
app.use(function(err, req, res, next) {
     // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  // res.json({
  //   'error': {
  //     'message': err.message,
  //     'status': err.status
  //   }
  // });
});

module.exports = app;
