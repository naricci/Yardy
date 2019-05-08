// Use dotenv to read .env vars into Node
require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('yardy:app');

// Require Mongoose Configuration
require('./config/db_config');

// For Heroku
const PORT = process.env.PORT || 5000;

// Routes
const index = require('./routes/index');
const users = require('./routes/users');
const yardsales = require('./routes/yardsales');

// Compression/Security Packages
const compression = require('compression');
const helmet = require('helmet');

// Authentication Packages
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const sess = {
	secret: 'yardy-session-secret',
	cookie: {},
	resave: true,	// false originally
	saveUninitialized: true,
	maxAge: 86400000,	// 1 day
	store: new MongoStore({
		url: process.env.MONGODB_URI,
		ttl: 7 * 24 * 60 * 60 // 7 days
	})
};

// Require Passport Strategies
require('./config/passport_config');

// Initialize Express App
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// used to display the json in pretty print format
app.set('json spaces', 2);

// trust first proxy for using cookies with HTTPS
if (app.get('env') === 'production') {
	app.set('trust proxy', 1);	// trust first proxy
	sess.cookie.secure = true;	// serve secure cookies
}

// Base Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Compress all routes
app.use(compression());
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'icons', 'favicon.ico')));

// Authentication related middleware.
app.use(flash());
app.use(session(sess));

// Initialize Passport and restore authentication state,
// if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Pass isAuthenticated and current_user to all views.
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.isAuthenticated();
	// Delete salt and hash fields from req.user object before passing it.
	let safeUser = req.user;
	if (safeUser) {
		delete safeUser._doc.salt;
		delete safeUser._doc.hash;
	}
	res.locals.current_user = safeUser;
	next();
});

// Use the Routes
app.use('/', index);
app.use('/users', users);
app.use('/yardsales', yardsales);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// Heroku Listening on Port ...
app.listen(PORT, () => {
	return debug(`Heroku listening on ${ PORT }`);
});

module.exports = app;
