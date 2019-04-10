const mongoose = require('mongoose');
let gracefulShutdown;
const debug = require('debug')('yardy:mongo');
// let dev_db_url = 'mongodb://localhost/yardy';
let dev_db_url = 'mongodb://nick:Yardy123@ds121475.mlab.com:21475/yardy';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
let db = mongoose.connection;

// Set up mongoose connection
if (process.env.NODE_ENV === 'production') {
	dev_db_url = process.env.MONGOLAB_URI;
}
mongoose.connect(mongoDB, {
	useNewUrlParser: true
});
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;


// MongoDB CONNECTION EVENTS
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

module.exports = db;
