const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const debug = require('debug')('Yardy:user.model');

// Create Schema and Model
var userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: [true, 'Username is required'],
		minlength: 4,
		maxlength: 25
	},
	salt: {
		type: String,
		required: true
	},
	hash: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: false,
		minlength: 1,
		maxlength: 25
	},
	lastName: {
		type: String,
		required: false,
		minlength: 1,
		maxlength: 25
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		maxlength: 25
	},
	phone: {
		type: String,
		required: false,
		maxlength: 9
	},
	address: {
		type: String,
		required: false,
		maxlength: 250
	},
	address2: {
		type: String,
		required: false,
		maxlength: 250
	},
	city: {
		type: String,
		required: false,
		maxlength: 25
	},
	state: {
		type: String,
		required: false,
		maxlength: 2
	},
	zipcode: {
		type: String,
		required: false,
		minlength: 5,
		maxlength: 5
	},
	createdDate: {
		type: Date,
		default: Date.now
	}
});

// Virtual for User's URL.
userSchema.virtual('url').get(() => {
	debug('Getting /users/' + this._id);
	return '/users/' + this._id;
});

// Virtual for User's Full Name.
userSchema.virtual('fullname').get(() => {
	debug('Getting ' + this.firstName + ' ' + this.lastName);
	return this.firstName + ' ' + this.lastName;
});

// Virtual for Yardsale/User instance URL.
// userSchema.virtual('sale_url').get(function() {
// 	return '/yardsales/user/' + this._id;
// });

// Instance method for hashing user-typed password.
userSchema.methods.setPassword = function(password) {
	// Create a salt for the user.
	this.salt = crypto.randomBytes(16).toString('hex');
	// Use salt to create hashed password.
	this.hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 128, 'sha512')
		.toString('hex');
	debug(`Salt: ${this.salt}, Hash: ${this.hash}`);
};

// Instance method for comparing user-typed password against hashed-password on db.
userSchema.methods.validatePassword = function(password) {
	var hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 128, 'sha512')
		.toString('hex');
	debug(hash);
	return this.hash === hash;
};

// Instance method for comparing user-typed passwords against each other.
userSchema.methods.passwordsMatch = function(password, passwordConfirm) {
	return password === passwordConfirm;
};

var User = mongoose.model('users', userSchema);

module.exports = User;
