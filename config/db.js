const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const debug = require('debug')('yardy:mongo');
const options = {
	useNewUrlParser: true,
	useCreateIndex: true,
	autoReconnect: true,
	useFindAndModify: false
};
let gracefulShutdown;
let dev_db_url = 'mongodb://nick:Yardy123@ds121475.mlab.com:21475/yardy';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
let db = mongoose.connection;

// Set up mongoose connection
if (process.env.NODE_ENV === 'production') {
	dev_db_url = process.env.MONGOLAB_URI;
}
mongoose.connect(mongoDB, options)
	.catch((err) => {
		debug(err);
	});

// MongoDB CONNECTION EVENTS
db.on('connected', () => {
	debug('Mongoose connected to ' + mongoDB);
});
db.on('error', (err) => {
	debug('Mongoose connection error: ' + err);
	process.exit(0);
});
db.on('disconnected', () => {
	debug('Mongoose disconnected');
});
// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = (msg, callback) => {
	db.close(() => {
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
