// Set up mongoose connection
const mongoose = require('mongoose');
const debug = require('debug')('Yardy:mongo');
var gracefulShutdown;
let dev_db_url = 'mongodb://nick:Yardy123@ds121475.mlab.com:21475/yardy';
let mongoDB = process.env.MONGODB_URI || dev_db_url;

if (process.env.NODE_ENV === 'production') {
	dev_db_url = process.env.MONGOLAB_URI;
}

mongoose.connect(dev_db_url, {
	useNewUrlParser: true
});
mongoose.set('useCreateIndex', true);

// mongoose.connect(mongoDB, { useNewUrlParser: true });
//   .then(() => {
//     console.log("Connected to the mLab MongoDB!");
// }).catch((err) => {
//     console.log("ERROR!  Not Connected to Database: ", err);
// });

mongoose.Promise = global.Promise;

// let db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
	debug('Mongoose connected to ' + dev_db_url);
});
mongoose.connection.on('error', function(err) {
	debug('Mongoose connection error: ' + err);
	process.exit(0);
});
mongoose.connection.on('disconnected', function() {
	debug('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
	mongoose.connection.close(function() {
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
