const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');

// Configure Passport authenticated session persistence.
exports.serializeU = passport.serializeUser((user, done) => {
	done(null, user._id);
});

exports.deserializeU = passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		if (err) return done(err);
		done(null, user);
	});
});

/* Local Login */
exports.local_login = passport.use('local-login', new LocalStrategy({
	// by default, local strategy uses username and password, we will override with email
	usernameField : 'email',
	passwordField : 'password',
	passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
},
function(req, email, password, done) {

	// asynchronous
	process.nextTick(function() {

		User.findOne({ 'local.email' :  email }, function(err, user) {
			// if there are any errors, return the error
			if (err) return done(err);

			// if no user is found, return the message
			if (!user)
				return done(null, false, req.flash('loginMessage', 'No user found.'));

			if (!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

			// all is well, return user
			else return done(null, user);
		});
	});
}));

/* Local Sign-up */
exports.local_signup = passport.use('local-signup', new LocalStrategy({
	// by default, local strategy uses username and password, we will override with email
	usernameField : 'email',
	passwordField : 'password',
	passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
},
(req, email, password, done) => {

	// asynchronous
	process.nextTick(function() {

		//  Whether we're signing up or connecting an account, we'll need
		//  to know if the email address is in use.
		// User.findOne({'local.email': email}, function(err, existingUser) {
		User.findOne({ 'local.email': email }, function(err, existingUser) {

			// if there are any errors, return the error
			if (err) return done(err);

			// check to see if there's already a user with that email
			if (existingUser)
				return done(null, false, req.flash('signupMessage', 'That email is already taken.'));

			//  If we're logged in, we're connecting a new local account.
			if(req.user) {
				var user = req.user;

				user.local.email = email;
				user.local.password = user.generateHash(password);
				user.save(function(err) {
					if (err) throw err;
					return done(null, user);
				});
			}
			//  We're not logged in, so we're creating a brand new user.
			else {
				// create the user
				var newUser = new User();

				newUser.local.email = email;
				newUser.email = email;
				newUser.local.password = newUser.generateHash(password);

				newUser.save(function(err) {
					if (err) throw err;
					return done(null, newUser);
				});
			}
		});
	});
}));

/* Facebook Login/Signup */
exports.facebook = passport.use(new FacebookStrategy({
	clientID: process.env.FACEBOOK_APP_ID,
	clientSecret: process.env.FACEBOOK_APP_SECRET,
	callbackURL: process.env.FACEBOOK_CALLBACK_URL,
	passReqToCallback : true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
	// profileFields: ['displayName', 'emails']
},
(req, token, refreshToken, profile, done) => {

	// asynchronous
	process.nextTick(function() {

		// check if the user is already logged in
		if (!req.user) {

			User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
				if (err) return done(err);

				if (user) {

					// if there is a user id already but no token (user was linked at one point and then removed)
					if (!user.facebook.token) {
						user.facebook.token = token;
						user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
						user.facebook.email = profile.emails[0].value;
						// user.firstName = profile.name.givenName;
						// user.lastName = profile.name.familyName;

						user.save(function(err) {
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
					newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
					newUser.facebook.email = profile.emails[0].value;
					newUser.email = profile.emails[0].value;
					newUser.firstName = profile.name.givenName;
					newUser.lastName = profile.name.familyName;

					newUser.save(function(err) {
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

// =========================================================================
// TWITTER =================================================================
// =========================================================================
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
