var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var debug = require('debug')('Yardy:user.model');

// const validateEmail = function (email) {
// 	var re = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;	// /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
// 	return re.test(email);
// };

// Create Schema and Model
var userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: [true, 'Username is required'],
		// TODO change username minlength/maxlength accordingly
		minlength: 1,
		maxlength: 25
	},
	// password: {
	// 	type: String,
	// 	// TODO change password minlength/maxlength accordingly
	// 	required: [true, 'Password is required'],
	// 	minlength: 1
	// },
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
		required: false
	},
	lastName: {
		type: String,
		required: false
	},
	email: {
		type: String,
		required: [true, 'Email is required']
		// validate: [validateEmail, 'Please fill a valid email address'],
		// match: [/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],	// /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
		// index: { unique: true, dropDups: true }
	},
	phone: {
		type: String,
		required: false
	},
	address: {
		type: String,
		required: false
	},
	address2: {
		type: String,
		required: false
	},
	city: {
		type: String,
		required: false
	},
	state: {
		type: String,
		required: false
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
	return '/users/' + this._id;
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
