// Use dotenv to read .env vars into Node
require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
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
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('./models/user');
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

// Initialize Express App
const app = express();

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

// // Configure the local strategy for use by Passport.
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

passport.use(new FacebookStrategy({
	clientID: process.env.FACEBOOK_APP_ID,
	clientSecret: process.env.FACEBOOK_APP_SECRET,
	callbackURL: process.env.FACEBOOK_CALLBACK_URL,
	passReqToCallback : true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
	profileFields: ['email', 'displayName', 'name']
},
(req, token, refreshToken, profile, done) => {
	console.log(profile);
	// asynchronous
	process.nextTick(() => {

		// check if the user is already logged in
		if (!req.user) {

			User.findOne({ 'facebook.id' : profile.id }, (err, user) => {
				if (err) return done(err);

				if (user) {

					// if there is a user id already but no token (user was linked at one point and then removed)
					if (!user.facebook.token) {
						user.facebook.token = token;
						user.facebook.name  = profile.displayName;
						user.facebook.email = profile.emails[0].value;

						user.save((err) => {
							if (err) throw err;
							return done(null, user);
						});
					}

					return done(null, user); // user found, return that user
				} else {
					// if there is no user, create them
					var newUser = new User();

					newUser.facebook.id = profile.id;
					newUser.facebook.token = token;
					newUser.facebook.name  = profile.displayName;
					newUser.facebook.email = profile.emails[0].value;
					// newUser.username = profile.username;
					newUser.email = profile.emails[0].value;
					newUser.firstName = profile.name.givenName;
					newUser.lastName = profile.name.familyName;

					newUser.save((err) => {
						if (err) throw err;
						return done(null, newUser);
					});
				}
			});

		} else {
			// user already exists and is logged in, we have to link accounts
			var user = req.user; // pull the user out of the session

			user.facebook.id = profile.id;
			user.facebook.token = token;
			user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
			user.facebook.email = profile.emails[0].value;

			user.save(function(err) {
				if (err) throw err;
				return done(null, user);
			});
		}
	});
}));

passport.use(new TwitterStrategy({

	consumerKey     : process.env.TWITTER_API_KEY,
	consumerSecret  : process.env.TWITTER_API_SECRET_KEY,
	callbackURL     : process.env.TWITTER_CALLBACK_URL,
	passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

},
function(req, token, tokenSecret, profile, done) {

	// asynchronous
	process.nextTick(function() {

		// check if the user is already logged in
		if (!req.user) {

			User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
				if (err)
					return done(err);

				if (user) {
					// if there is a user id already but no token (user was linked at one point and then removed)
					if (!user.twitter.token) {
						user.twitter.token       = token;
						user.twitter.username    = profile.username;
						user.twitter.displayName = profile.displayName;

						user.save(function(err) {
							if (err)
								throw err;
							return done(null, user);
						});
					}

					return done(null, user); // user found, return that user
				} else {
					// if there is no user, create them
					var newUser                 = new User();

					newUser.twitter.id          = profile.id;
					newUser.twitter.token       = token;
					newUser.twitter.username    = profile.username;
					newUser.twitter.displayName = profile.displayName;

					newUser.save(function(err) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				}
			});

		} else {
			// user already exists and is logged in, we have to link accounts
			var user                 = req.user; // pull the user out of the session

			user.twitter.id          = profile.id;
			user.twitter.token       = token;
			user.twitter.username    = profile.username;
			user.twitter.displayName = profile.displayName;

			user.save(function(err) {
				if (err)
					throw err;
				return done(null, user);
			});
		}
	});
}));


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
// app.use(passport.initialize((user, done) => {
// 	done(null, user.id);
// }));
// app.use(passport.session((id, done) => {
// 	User.findById(id, (err, user) => {
// 		done(err, user);
// 	});
// }));
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
