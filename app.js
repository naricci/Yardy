var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var tediousExpress = require('express4-tedious');
// var cors = require('cors');

var indexRouter = require('./routes/index');

var app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var config = {
        server: 'sql.neit.edu.SE425_Yardy.windows.net',
        options: {
            port: 4500,
            encrypt: true,
            database: 'SE425_Yardy'
        }, authentication: {
            type: "default",
            options: {
                userName: 'NRicci',
                password: '001405200'
            }
        }
    };

// Express4-Tedious Middleware
app.use(function(req, res, next) {
    req.sql = tediousExpress({ config });
    next();
});
// Middleware
app.use(logger('dev')); // set the app to auto log request and response values
app.use(express.json());    // for parsing application/json
app.use(express.urlencoded({ extended: false }));    // parse application/x-www-form-urlencoded
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// CORS Middleware
// app.use(function (req, res, next) {
//     //Enabling CORS
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
//     next();
// });

app.use('/', indexRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

module.exports = app;




