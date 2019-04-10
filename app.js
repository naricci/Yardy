const createError = require('http-errors');
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('yardy:heroku');

// Mongoose Connection
let dev_db_url = 'mongodb://nick:Yardy123@ds121475.mlab.com:21475/yardy';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
require('./db');

// Use dotenv to read .env vars into Node
require('dotenv').config();

// For Heroku
const cool = require('cool-ascii-faces');
const PORT = process.env.PORT || 5000;

// Routes
const index = require('./routes/index');
const users = require('./routes/users');
const catalog = require('./routes/catalog');

// Compression/Security Packages
const compression = require('compression');
const helmet = require('helmet');

// Authentication Packages
// var auth = require('./lib/auth');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const sess = {
	secret: 'yardy-session-secret',
	cookie: {},
	resave: false,
	saveUninitialized: true,
	maxAge: 86400000,	// 1 day
	store: new MongoStore({
		url: mongoDB,
		ttl: 7 * 24 * 60 * 60 // 7 days. 14 is Default.
	})
};

// Initialize Express App
const app = express();

// app.get('/', (req, res) => { return res.render('pages/index'); });
app.get('/cool', (req, res) => { return res.send(cool()); });
// app.listen(PORT, () => { return debug(`Heroku listening on ${ PORT }`); });
app.listen(PORT);

// Configure the local strategy for use by Passport.
passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: 'Incorrect username. ' });
			}
			if (!user.validatePassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		});
	}
));

// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		if (err) {
			return done(err);
		}
		done(null, user);
	});
});

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

// Middleware
app.use(logger('dev'));
app.use(express.json());
// app.use(session({ secret: 'yardy' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compression()); // Compress all routes
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'icons', 'favicon.ico')));
// app.use(express.static('bower_components'));	// not using on final deployment

// a middleware function with no mount path.
// This code is executed for every request to the router
// app.use(function (req, res, next) {
// 	debug('Time:', Date.now());
// 	next();
// });

// Authentication related middleware.
app.use(flash());
app.use(session(sess));

// Initialize Passport and restore authentication state, if any,
// from the session.
app.use(passport.initialize());
app.use(passport.session());

// Pass isAuthenticated and current_user to all views.
app.use(function(req, res, next) {
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

// Use our Authentication and Authorization middleware.
// app.use(auth);

app.use('/', index);
app.use('/users', users);
app.use('/catalog', catalog);

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
