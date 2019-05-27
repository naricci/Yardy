
require('dotenv').config();
require('./config/db_config');

const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const createError = require('http-errors');
const debug = require('debug')('yardy:app');
const express = require('express');
const favicon = require('serve-favicon');
const flash = require('express-flash');
const helmet = require('helmet');
const logger = require('morgan');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Routes
const index = require('./routes/index');
const favorites = require('./routes/favorites');
const messages = require('./routes/messages');
const users = require('./routes/users');
const yardsales = require('./routes/yardsales');
const PORT = process.env.PORT || 5000;

// Session Configuration
const sess = {
	secret: 'yardy-session-secret',
	cookie: {},
	resave: true,	// false originally
	saveUninitialized: true,
	// maxAge: 2 * 24 * 60 * 60, // 2 days //86400000,	// 1 day
	store: new MongoStore({
		url: process.env.MONGODB_URI,
		ttl: 14 * 24 * 60 * 60 // 14 days
	})
};

// Options for serving static files
const options = {
	maxAge: 31536000
};

// Initialize Express App
const app = express();

require('./config/passport_config');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('json spaces', 4);

// trust first proxy for using cookies with HTTPS
if (app.get('env') === 'production') {
	app.set('trust proxy', 1);	// trust first proxy
	sess.cookie.secure = true;	// serve secure cookies
}

// Base Middleware
app.use(compression());	// Compress all routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(helmet());
app.use(express.static(path.join('public'), options));
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

// enable Cross-Origin Resource Sharing (CORS)
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
	next();
});

// Use the Routes
app.use('/', index);
app.use('/favorites', favorites);
app.use('/messages', messages);
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
	if (res.json) {
		res.json({
			'error': {
				'message': err.message,
				'status' : err.status
			}
		});
	}
	else res.render('error');
});

// Heroku Listening on Port ...
app.listen(PORT, () => debug(`Heroku listening on ${ PORT }`));

module.exports = app;
