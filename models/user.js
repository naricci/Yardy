// const mongoose = require('mongoose');
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// const crypto = require('crypto');
import crypto from 'crypto';

// Create Schema and Model
const UserSchema = new Schema({
	username: {
		type: String,
		unique: true,
		// required: [true, 'Username is required'],
		minlength: 4,
		maxlength: 25
	},
	salt: {
		type: String,
		// required: true
	},
	hash: {
		type: String,
		// required: true
	},
	email: {
		type: String,
		unique: true,
		// required: [true, 'Email is required'],
		maxlength: 25
	},
	firstName: {
		type: String,
		required: false,
		maxlength: 25
	},
	lastName: {
		type: String,
		required: false,
		maxlength: 25
	},
	phone: {
		type: String,
		maxlength: 10
	},
	address: {
		type: String,
		maxlength: 250
	},
	address2: {
		type: String,
		maxlength: 250
	},
	city: {
		type: String,
		maxlength: 25
	},
	state: {
		type: String,
		maxlength: 2
	},
	zipcode: {
		type: String,
		minlength: 5,
		maxlength: 5
	},
	profilepic: {
		type: String,
		maxlength: 50
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	twitter: {
		id: String,
		token: String,
		displayName: String,
		username: String
	},
	createdDate: {
		type: Date,
		default: Date.now
	}
});

// Virtual for User's URL.
UserSchema
	.virtual('url')
	.get(() => {
		return '/users/' + this.user._id;
	});

// Virtual Getter/Setter for User's Full Name.
UserSchema
	.virtual('fullname')
	.get(() => {
		return this.firstName + ' ' + this.lastName;
	})
	.set((setFullNameTo) => {
		var split = setFullNameTo.split(' '),
			firstName = split[0],
			lastName = split[1];

		this.set('name.first', firstName);
		this.set('name.last', lastName);
	});

// Instance method for hashing user-typed password.
UserSchema.methods.setPassword = function(password) {
	// Create a salt for the user.
	this.salt = crypto.randomBytes(16).toString('hex');
	// Use salt to create hashed password.
	this.hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 128, 'sha512')
		.toString('hex');
};

// Instance method for comparing user-typed password against hashed-password on db.
UserSchema.methods.validatePassword = function(password) {
	let hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 128, 'sha512')
		.toString('hex');
	return this.hash === hash;
};

// Instance method for comparing user-typed passwords against each other.
UserSchema.methods.passwordsMatch = function(password, passwordConfirm) {
	return password === passwordConfirm;
};

const User = mongoose.model('users', UserSchema);

// module.exports = User;
export default User;
