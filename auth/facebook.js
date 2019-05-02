var passport = require('passport')
	, FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/User');

passport.use(new FacebookStrategy({
	clientID: process.env.FACEBOOK_APP_ID,
	clientSecret: process.env.FACEBOOK_APP_SECRET,
	callbackURL: process.env.FACEBOOK_CALLBACK_URL,
},
function(accessToken, refreshToken, profile, done) {
	User.findOrCreate({name: profile.displayName}, {name: profile.displayName,userid: profile.id}, function(err, user) {
		if (err) { return done(err); }
		done(null, user);
	});
}
));

module.exports = passport;
