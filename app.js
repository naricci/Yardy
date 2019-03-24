const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('yardy:mongo');
const heroku = require('debug')('yardy:heroku');

// Use dotenv to read .env vars into Node
// require('dotenv').config();

// For Heroku
const cool = require('cool-ascii-faces');
const PORT2 = process.env.PORT2 || 5000;

// Routes
// var auth = require('./lib/auth');
const index = require('./routes/index');
const users = require('./routes/users');
const catalog = require('./routes/catalog');

const compression = require('compression');
const helmet = require('helmet');

const app = express();
// app.get('/', (req, res) => { return res.render('pages/index'); });
app.get('/cool', (req, res) => { return res.send(cool()); });
app.listen(PORT2, () => { return heroku(`Heroku listening on ${ PORT2 }`); });

// Set up mongoose connection
const mongoose = require('mongoose');
var gracefulShutdown;
// var dev_db_url = 'mongodb://localhost/yardy';
const dev_db_url = 'mongodb://nick:Yardy123@ds121475.mlab.com:21475/yardy';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
// if (process.env.NODE_ENV === 'production') {
// 	dev_db_url = process.env.MONGOLAB_URI;
// }
mongoose.connect(mongoDB, {
	useNewUrlParser: true
});
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
// CONNECTION EVENTS
db.on('connected', function() {
	debug('Mongoose connected to ' + mongoDB);
});
db.on('error', function(err) {
	debug('Mongoose connection error: ' + err);
	process.exit(0);
});
db.on('disconnected', function() {
	debug('Mongoose disconnected');
});
// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
	db.close(function() {
		debug('Mongoose disconnected through ' + msg);
		callback();
	});
};
// For nodemon restarts
process.once('SIGUSR2', function() {
	gracefulShutdown('nodemon restart', function() {
		process.kill(process.pid, 'SIGUSR2');
	});
});
// For app termination
process.on('SIGINT', function() {
	gracefulShutdown('app termination', function() {
		process.exit(0);
	});
});
// For Heroku app termination
process.on('SIGTERM', function() {
	gracefulShutdown('Heroku app termination', function() {
		process.exit(0);
	});
});
process.on('exit', function(code) {
	debug('About to exit with code: ', code);
});

// Authentication Packages
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);

// Configure the local strategy for use by Passport.
passport.use(
	new LocalStrategy(function(username, password, callback) {
		User.findOne({ username: username }, function(err, user) {
			if (err) {
				return callback(err);
			}
			if (!user) {
				return callback(null, false, { message: 'Incorrect username. ' });
			}
			if (!user.validatePassword(password)) {
				return callback(null, false, { message: 'Incorrect password.' });
			}
			return callback(null, user);
		});
	})
);

// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, callback) {
	callback(null, user._id);
});

passport.deserializeUser(function(id, callback) {
	User.findById(id, function(err, user) {
		if (err) {
			return callback(err);
		}
		callback(null, user);
	});
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// used to display the json in pretty print format
app.set('json spaces', 2);

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compression()); // Compress all routes
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('bower_components'));	// not using on final deployment

// a middleware function with no mount path.
// This code is executed for every request to the router
app.use(function (req, res, next) {
	debug('Time:', Date.now());
	next();
});

// Authentication related middleware.
app.use(flash());
app.use(
	session({
		secret: 'yardy-session-secret',
		resave: false,
		saveUninitialized: true,
		store: new MongoStore({
			url: mongoDB,
			ttl: 7 * 24 * 60 * 60 // 7 days. 14 is Default.
		})
		// cookie: { secure: true }		// requires HTTPS
	})
);

// Initialize Passport and restore authentication state, if any,
// from the session.
app.use(passport.initialize());
app.use(passport.session());

// Pass isAuthenticated and current_user to all views.
app.use(function(req, res, next) {
	res.locals.isAuthenticated = req.isAuthenticated();
	// Delete salt and hash fields from req.user object before passing it.
	var safeUser = req.user;
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
