// Use dotenv to read .env vars into Node
require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
// const expressValidator = require('express-validator');
const favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('yard:app');
// Mongoose Configuration
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
const LocalStrategy = require('passport-local').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
// require('/middlewares/passport');
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
		url: process.env.MONGODB_URI,
		ttl: 7 * 24 * 60 * 60 // 7 days
	})
};
// Initialize Express App
const app = express();

// Heroku Listening on Port ...
app.listen(PORT, () => {
	return debug(`Heroku listening on ${ PORT }`);
});

// Configure the local strategy for use by Passport.
passport.use(new LocalStrategy(
	(username, password, done) => {
		User.findOne({ username: username }, (err, user) => {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: 'Username does not exist. ' });
			}
			if (!user.validatePassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		});
	}
));

// Configure Passport authenticated session persistence.
passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
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

// Base Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(expressValidator());

app.use(compression()); // Compress all routes
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'icons', 'favicon.ico')));

// Authentication related middleware.
app.use(flash());
app.use(session(sess));

// Initialize Passport and restore authentication state,
// if any, from the session.
app.use(passport.initialize((user, done) => {
	done(null, user.id);
}));
app.use(passport.session((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
}));

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

// passport.use(new FacebookStrategy({
// 	clientID: process.env.FACEBOOK_APP_ID,
// 	clientSecret: process.env.FACEBOOK_APP_SECRET,
// 	callbackURL: process.env.FACEBOOK_CALLBACK_URL
// 	// profileURL: process.env.FACEBOOK_PROFILE_URL,
// 	// profileFields: ['id', 'email', 'name'] // For requesting permissions from Facebook API
// },
// function(accessToken, refreshToken, profile, done) {
// 	// User
// 	// 	.findOrCreate(..., function(err, user) {
// 	// 		if (err) { return done(err); }
// 	// 		done(null, user);
// 	// 	});
// // find the user in the database based on their facebook id
// 	User.findOrCreate({ 'facebook.id' : profile.id }, function(err, user) {
//
// 		// if there is an error, stop everything and return that
// 		// ie an error connecting to the database
// 		if (err)
// 			return done(err);
//
// 		// if the user is found, then log them in
// 		if (user) {
// 			return done(null, user); // user found, return that user
// 		} else {
// 			// if there is no user found with that facebook id, create them
// 			var newUser = new User();
//
// 			// set all of the facebook information in our user model
// 			newUser.facebook.id    = profile.id; // set the users facebook id
// 			newUser.facebook.accessToken = accessToken; // we will save the token that facebook provides to the user
// 			newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
// 			newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
//
// 			// save our user to the database
// 			newUser.save(function(err) {
// 				if (err)
// 					throw err;
//
// 				// if successful, return the new user
// 				return done(null, newUser);
// 			});
// 		}
// 	});
// }
// ));

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

module.exports = app;
