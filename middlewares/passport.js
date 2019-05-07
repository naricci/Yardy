const LocalStrategy    = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy  = require('passport-twitter').Strategy;

// load up the user model
const User = require('../models/user');

// load the auth variables
// var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {

	// =========================================================================
	// passport session setup ==================================================
	// =========================================================================
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize users out of session

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// =========================================================================
	// LOCAL LOGIN =============================================================
	// =========================================================================
	passport.use('local-login', new LocalStrategy({
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
				if (err)
					return done(err);

				// if no user is found, return the message
				if (!user)
					return done(null, false, req.flash('loginMessage', 'No user found.'));

				if (!user.validPassword(password))
					return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

				// all is well, return user
				else
					return done(null, user);
			});
		});
	}));

	// =========================================================================
	// LOCAL SIGNUP ============================================================
	// =========================================================================
	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
	},
	function(req, email, password, done) {

		// asynchronous
		process.nextTick(function() {

			//  Whether we're signing up or connecting an account, we'll need
			//  to know if the email address is in use.
			User.findOne({'local.email': email}, function(err, existingUser) {

				// if there are any errors, return the error
				if (err)
					return done(err);

				// check to see if there's already a user with that email
				if (existingUser)
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));

				//  If we're logged in, we're connecting a new local account.
				if(req.user) {
					var user            = req.user;
					user.local.email    = email;
					user.local.password = user.generateHash(password);
					user.save(function(err) {
						if (err)
							throw err;
						return done(null, user);
					});
				}
				//  We're not logged in, so we're creating a brand new user.
				else {
					// create the user
					var newUser            = new User();

					newUser.local.email    = email;
					newUser.local.password = newUser.generateHash(password);

					newUser.save(function(err) {
						if (err)
							throw err;

						return done(null, newUser);
					});
				}
			});
		});
	}));

	// =========================================================================
	// FACEBOOK ================================================================
	// =========================================================================
	passport.use(new FacebookStrategy({
		clientID: process.env.FACEBOOK_APP_ID,
		clientSecret: process.env.FACEBOOK_APP_SECRET,
		callbackURL: process.env.FACEBOOK_CALLBACK_URL,
		passReqToCallback : true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
		// profileFields: ['displayName', 'emails']
	},
	function(req, token, refreshToken, profile, done) {

		// asynchronous
		process.nextTick(function() {

			// check if the user is already logged in
			if (!req.user) {

				User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
					if (err)
						return done(err);

					if (user) {

						// if there is a user id already but no token (user was linked at one point and then removed)
						if (!user.facebook.token) {
							user.facebook.token = token;
							user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
							user.facebook.email = profile.emails[0].value;

							user.save(function(err) {
								if (err)
									throw err;
								return done(null, user);
							});
						}

						return done(null, user); // user found, return that user
					} else {
						// if there is no user, create them
						var newUser            = new User();

						newUser.facebook.id    = profile.id;
						newUser.facebook.token = token;
						newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
						newUser.facebook.email = profile.emails[0].value;
						//

						newUser.save(function(err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
					}
				});

			} else {
				// user already exists and is logged in, we have to link accounts
				var user            = req.user; // pull the user out of the session

				user.facebook.id    = profile.id;
				user.facebook.token = token;
				user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
				user.facebook.email = profile.emails[0].value;

				user.save(function(err) {
					if (err)
						throw err;
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
};
