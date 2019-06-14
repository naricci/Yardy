const debug = require('debug')('yardy:passport');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');

// Configure the local strategy for use by Passport.
passport.use(new LocalStrategy(
	(username, password, done) => {
		User.findOne({ username: username }, (err, user) => {
			if (err) return done(err);
			if (!user) {
				return done(null, false, { message: 'Username does not exist.' });
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
	profileFields: ['email', 'displayName', 'name'],
	passReqToCallback : true, // checks if a user is logged in or not
	enableProof: true
},
(req, token, refreshToken, profile, done) => {
	debug(profile);
	// asynchronous
	process.nextTick(() => {
		// check if the user is already logged in
		if (!req.user) {
			User.findOne({ 'facebook.id' : profile.id }, (err, user) => {
				if (err) return done(err);
				if (user) {
					// if there is a user id already but no token (user was linked at one point and then removed)
					if (!user.facebook.token) {
						user.facebook.id = profile.id;
						user.facebook.token = token;
						user.facebook.name  = profile.displayName;
						user.facebook.email = profile.emails[0].value;

						// Save current user's Facebook data to Mongo DB
						user.save(err => {
							if (err) throw err;
							debug(`Saving...${user}`);
							return done(null, user);
						});
					}
					return done(null, user); // user found, return that user
				} else {
					// if there is no user, create them
					const newUser = new User();
					newUser.facebook.id = profile.id;
					newUser.facebook.token = token;
					newUser.facebook.name  = profile.displayName;
					newUser.facebook.email = profile.emails[0].value;
					newUser.username = profile.emails[0].value;
					newUser.email = profile.emails[0].value;
					newUser.firstName = profile.name.givenName;
					newUser.lastName = profile.name.familyName;

					// Save New User to Mongo DB
					newUser.save(err => {
						if (err) throw err;
						debug(`Saving...${newUser}`);
						return done(null, newUser);
					});
				}
			});
		} else {
			// user already exists and is logged in, we have to link accounts
			const user = req.user; // pull the user out of the session
			user.facebook.id = profile.id;
			user.facebook.token = token;
			user.facebook.name = profile.displayName;
			user.facebook.email = profile.emails[0].value;

			// Save current user's Facebook data to Mongo DB
			user.save(err => {
				if (err) throw err;
				debug(`Saving...${user}`);
				return done(null, user);
			});
		}
	});
}));

passport.use(new TwitterStrategy({
	consumerKey: process.env.TWITTER_API_KEY,
	consumerSecret: process.env.TWITTER_API_SECRET_KEY,
	callbackURL: process.env.TWITTER_CALLBACK_URL,
	// includeEmail: true,
	passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
},
(req, token, tokenSecret, profile, done) => {
	debug(profile);
	// asynchronous
	process.nextTick(() => {
		// check if the user is already logged in
		if (!req.user) {
			User.findOne({ 'twitter.id' : profile.id }, (err, user) => {
				if (err) return done(err);
				if (user) {
					// if there is a user id already but no token (user was linked at one point and then removed)
					if (!user.twitter.token) {
						user.twitter.token = token;
						user.twitter.username = profile.username;
						user.twitter.displayName = profile.displayName;

						// Save current user's Twitter data to Mongo DB
						user.save(err => {
							if (err) throw err;
							debug(`Saving...${user}`);
							return done(null, user);
						});
					}
					return done(null, user); // user found, return that user
				} else {
					// split data into appropriate fields
					const nameSplitter = profile.displayName.split(' ');
					const locationSplitter = profile._json.location.split(',');

					// if there is no user, create them
					const newUser = new User();
					newUser.twitter.id = profile.id;
					newUser.twitter.token = token;
					newUser.twitter.username = profile.username;
					newUser.twitter.displayName = profile.displayName;
					newUser.username = profile.username;
					newUser.firstName = nameSplitter[0];
					newUser.lastName = nameSplitter[1];
					newUser.profilepic = profile.photos[0].value;
					newUser.city = locationSplitter[0];
					newUser.state = locationSplitter[1].trim();

					// Save New User to Mongo DB
					newUser.save(err => {
						if (err) throw err;
						debug(`Saving...${newUser}`);
						return done(null, newUser);
					});
				}
			});
		} else {
			// user already exists and is logged in, we have to link accounts
			const user = req.user; // pull the user out of the session
			user.twitter.id = profile.id;
			user.twitter.token = token;
			user.twitter.username = profile.username;
			user.twitter.displayName = profile.displayName;

			// Save current user's Twitter data to Mongo DB
			user.save(err => {
				if (err) throw err;
				debug(`Saving...${user}`);
				return done(null, user);
			});
		}
	});
}));

// Configure Passport authenticated session persistence.
passport.serializeUser((user, done) => {
	debug(`${user.username} is logging in...`);
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		if (err) return done(err);
		done(null, user);
	});
});
