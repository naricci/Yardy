const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const debug = require('debug')('yardy:mongo');
const mongoDB = process.env.MONGODB_URI;
const options = {
	autoIndex: false,	// set to false in production to prevent performance issues
	autoReconnect: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useNewUrlParser: true
};
const db_config = mongoose.connection;
let gracefulShutdown;

// Set up mongoose connection
mongoose.connect(mongoDB, options)
	.catch(err => {
		debug(err);
	});

// MongoDB CONNECTION EVENTS
db_config.on('connected', () => {
	debug('Mongoose connected to ' + mongoDB);
});
db_config.on('error', (err) => {
	debug('Mongoose connection error: ' + err);
	process.exit(0);
});
db_config.on('disconnected', () => {
	debug('Mongoose disconnected');
});
// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = (msg, callback) => {
	db_config.close(() => {
		debug('Mongoose disconnected through ' + msg);
		callback();
	});
};
// For nodemon restarts
process.once('SIGUSR2', () => {
	gracefulShutdown('nodemon restart', () => {
		process.kill(process.pid, 'SIGUSR2');
	});
});
// For app termination
process.on('SIGINT', () => {
	gracefulShutdown('app termination', () => {
		process.exit(0);
	});
});
// For Heroku app termination
process.on('SIGTERM', () => {
	gracefulShutdown('Heroku app termination', () => {
		process.exit(0);
	});
});
process.on('exit', (code) => {
	debug('About to exit with code: ', code);
});
