const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

// Create Schema and Model
const UserSchema = new Schema({
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
		maxlength: 25
	},
	lastName: {
		type: String,
		required: false,
		maxlength: 25
	},
	email: {
		type: String,
		unique: true,
		required: [true, 'Email is required'],
		maxlength: 25
	},
	phone: {
		type: String,
		required: false,
		maxlength: 10
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
	yardsales: {
		type: [Schema.Types.ObjectId],
		ref: 'yardsales',
		required: false
	},
	createdDate: {
		type: Date,
		default: Date.now
	}
});

// Virtual for User's URL.
UserSchema
	.virtual('url')
	.get(function() {
		return '/users/' + this.user._id;
	});

// Virtual Getter/Setter for User's Full Name.
UserSchema
	.virtual('fullname')
	.get(() => {
		return this.firstName + ' ' + this.lastName;
	})
	.set(function(setFullNameTo) {
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

module.exports = User;
