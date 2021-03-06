const async = require('async');
const debug = require('debug')('yardy:user.controller');
const { validationResult } = require('express-validator/check');
const passport = require('passport');
const S3 = require('../config/s3_config');
const helpers = require('../util/helpers.js');
const User = require('../models/user');
const Yardsale = require('../models/yardsale');

// Display detail page for a specific user.
exports.user_profile = (req, res, next) => {
	async.parallel({
		user: callback => {
			User
				.findById(req.params.id)
				.exec(callback);
		},
		yardsales: callback => {
			Yardsale
				.find({ 'user': req.params.id }, 'date starttime endtime address city state zipcode description imagename')
				.sort([['date', 'ascending']])
				.exec(callback);
		},
	}, (err, results) => {
		if (err) return next(err); // Error in API usage.
		if (results.user === null) { // No results.
			let err = new Error('User not found');
			err.status = 404;
			return next(err);
		}
		else if (results.yardsales === null) { // No results.
			let err = new Error('Yardsales not found');
			err.status = 404;
			return next(err);
		}
		else {
			res.render('user_profile', {
				title: 'Your Yard Sales',
				user: results.user,
				yardsales: results.yardsales
			});
		}
	});
};

// Display login form on GET.
exports.login_get = [
	helpers.isAlreadyLoggedIn,
	(req, res) => {
		let messages = helpers.extractFlashMessages(req);
		res.render('user_login', {
			title: 'Login',
			errors: messages.length > 0 ? messages : null
		});
	}
];

// Display warning page on GET.
exports.warning = (req, res) => {
	let messages = helpers.extractFlashMessages(req);
	res.render('user_warning', {
		title: 'Sorry!',
		errors: messages.length > 0 ? messages : null
	});
};

// Handle login form on POST
exports.login_post = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/users/login',
	failureFlash: true
});

// Handle logout on GET.
exports.logout_get = (req, res) => {
	req.logout();
	req.session.destroy(() => {
		res.redirect('/');
	});
};

// Display register form on GET.
exports.register_get = [
	helpers.isAlreadyLoggedIn,
	// Continue processing.
	(req, res) => {
		res.render('user_form', {
			title: 'Create User'
		});
	}
];

// Handle register on POST.
exports.register_post = (req, res, next) => {
	// Extract the validation errors from a request.
	const errors = validationResult(req);
	// Get a handle on errors.array() array,
	// so we can push our own error messages into it.
	let errorsArray = errors.array();

	// Create a user object with escaped and trimmed data.
	let user = new User({
		username: req.body.username,
		email: req.body.email
	});

	// Check if passwords match or not.
	if (!user.passwordsMatch(req.body.password, req.body.cpassword)) {
		// Passwords do not match. Create and push an error message.
		errorsArray.push({ msg: 'Passwords do not match.' });
	}

	if (!errors.isEmpty()) {
		// There are errors. Render the form again with sanitized values/error messages.
		// return res.status(422).jsonp(errorsArray);
		res.render('user_form', {
			title: 'Create User',
			user: user,
			errors: errorsArray
		});
	} else {
		// Passwords match. Set password.
		user.setPassword(req.body.password);

		// Check if User with same username already exists.
		User
			.findOne({ username: req.body.username, email: req.body.email })
			.exec((err, found_user, found_email) => {
				if (err) return next(err);
				if (found_user) {
					// Username exists, re-render the form with error message.
					res.render('user_form', {
						title: 'Create User',
						user: user,
						errors: [{ msg: 'Username already taken. Choose another one.' }]
					});
					if (found_email) {
						// Email exists, re-render the form with error message.
						res.render('user_form', {
							title: 'Create User',
							user: user,
							errors: [{msg: 'Email already taken. Choose another one.'}]
						});
					}
				} else {
					// User does not exist. Create it.
					user.save(err => {
						if (err) return next(err);
						debug('User Created Successfully\n' + user);
						// User saved. Redirect to login page.
						req.flash(
							'success',
							'Successfully registered. You can log in now!'
						);
						res.redirect('/users/login');
					});
				}
			});
	}
};

// Display update form on GET.
exports.update_get = (req, res, next) => {
	User
		.findById(req.params.id)
		.exec()
		.catch((err, found_user) => {
			if (err) return next(err);
			if (found_user === null) {
				let err = new Error('User not found');
				err.status = 404;
				return next(err);
			}
		})
		.then(found_user => {
			// Successful, so render
			res.render('user_form', {
				title: 'Update Profile',
				user: found_user,
				is_update_form: true
			});
		});
};

// Handle update on POST.
exports.update_post = (req, res, next) => {
	// Extract the validation errors from a request.
	var errors = validationResult(req);
	// Get a handle on errors.array() array.
	var errorsArray = errors.array();

	// Create a user object with escaped and trimmed data and the old _id!
	let user = new User({
		username: req.body.username,
		firstName: req.body.firstname,
		lastName: req.body.lastname,
		fullname: req.body.fullname,
		email: req.body.email,
		phone: req.body.phone,
		address: req.body.address,
		address2: req.body.address2,
		city: req.body.city,
		state: req.body.state,
		zipcode: req.body.zipcode,
		_id: req.params.id
	});

	// Update password only if the user filled both password fields
	if (req.body.password !== '' && req.body.cpassword !== '') {
		// -- The user wants to change password. -- //

		// Check if passwords match or not.
		if (!user.passwordsMatch(req.body.password, req.body.cpassword)) {
			// Passwords do not match. Create and push an error message.
			errorsArray.push({ msg: 'Passwords do not match.' });
		} else {
			// Passwords match. Set password.
			user.setPassword(req.body.password);
		}
	} else {
		// -- The user does not want to change password. -- //

		// Remove warnings that may be coming from the body(..) validation step above.
		let filteredErrorsArray = [];
		errorsArray.forEach(errorObj => {
			if (!(errorObj.param === 'password' || errorObj.param === 'cpassword'))
				filteredErrorsArray.push(errorObj);
		});
		// Assign filtered array back to original array.
		errorsArray = filteredErrorsArray;
	}

	if (errorsArray.length > 0) {
		// There are errors. Render the form again with sanitized values/error messages.
		res.render('user_form', {
			title: 'Update Profile',
			user: user,
			errors: errorsArray,
			is_update_form: true
		});
	} else {
		debug('Updating user id: ' + req.user._id.toString());
		// Data from form is valid. Update the record.
		User
			.findByIdAndUpdate(req.params.id, user, {}, (err, theuser) => {
				if (err) return next(err);
				// Successful - redirect to user detail page.
				res.redirect('/users/'+theuser._id);
			});
	}
};

// Display reset password form on GET.
exports.reset_get = [
	helpers.isAlreadyLoggedIn,
	(req, res) => {
		res.render('user_reset', {
			title: 'Reset Password',
			is_first_step: true
		});
	}
];

// Handle reset password on POST (1st step).
exports.reset_post = (req, res, next) => {
	// Extract the validation errors from a request.
	let errors = validationResult(req);
	// Get a handle on errors.array() array.
	let errorsArray = errors.array();

	// Create a user object with escaped and trimmed data.
	let user = new User({
		username: req.body.username,
		email: req.body.email
	});

	if (errorsArray.length > 0) {
		// There are errors. Render the form again with sanitized values/error messages.
		// The user couldn't pass this step yet. Hence we're still in the first step!
		res.render('user_reset', {
			title: 'Reset Password',
			is_first_step: true,
			user: user, // Pass user object created with user-entered values.
			errors: errorsArray
		});
	} else {
		// Data from form is valid.

		// Check if User exists.
		User
			.findOne({ username: req.body.username, email: req.body.email })
			.exec()
			.then(
				(err, found_user) => {
					if (err) return next(err);
					if (found_user) {
						// User exists and credentials did match. Proceed to the second step.
						// And pass found_user to the form. We'll need user._id in the final step.
						res.render('user_reset', {
							title: 'Reset Password',
							is_second_step: true,
							user: found_user // Pass found_user.
						});
					} else {
						// User does not exist or credentials didn't match.
						// Render the form again with error messages. Still first step!
						res.render('user_reset', {
							title: 'Reset Password',
							is_first_step: true,
							user: user, // Pass user object created with user-entered values.
							errors: [{ msg: 'The user does not exist or credentials did not match a user. Try again.' }]
						});
					}
				}
			);
	}
};

// Handle reset password on POST (2nd step).
exports.reset_post_final = (req, res, next) => {
	// Extract the validation errors from a request.
	let errors = validationResult(req);

	// Get a handle on errors.array() array.
	let errorsArray = errors.array();

	// Create a user object containing only id field, for now.
	// We need to use old _id, which is coming from found_user passed in the first step.
	let user = new User({
		_id: req.body.userid
	});

	// -- Custom Validation -- //
	// Check if passwords match or not.
	if (!user.passwordsMatch(req.body.password, req.body.cpassword)) {
		// Passwords do not match. Create and push an error message.
		errorsArray.push({ msg: 'Passwords do not match.' });
	}

	if (errorsArray.length > 0) {
		// There are errors. Render the form again with sanitized values/error messages.
		res.render('user_reset', {
			title: 'Reset Password',
			is_second_step: true,
			user: user, // We need to pass user back to form because we will need user._id in the next step.
			errors: errorsArray
		});

	} else {
		// Passwords match. Set password.
		user.setPassword(req.body.password);

		// Update the record.
		async.waterfall(
			[
				callback => {
					User
						.findById(req.body.userid)
						.exec(callback)
						.catch(err => next(err));
				},
				(found_user, callback) => {
					User
						.findByIdAndUpdate(req.body.userid, user, {})
						.exec(callback)
						.catch(err => next(err));
				}
			],
			err => {
				if (err) return next(err);
				// Success, redirect to login page and show a flash message.
				req.flash(
					'success',
					'You have successfully changed your password. You can log in now!'
				);
				res.redirect('/users/login');
			}
		);
	}
};

// Display profile picture update page on GET
exports.profilepic_get = (req, res, next) => {
	debug(`Getting user ${req.user.username}'s profilepic page`);
	User
		.findById(req.params.id)
		.exec()
		.catch((err, found_user) => {
			if (err) return next(err);
			if (found_user === null) {
				let err = new Error('User not found');
				err.status = 404;
				return next(err);
			}
		})
		.then(found_user => {
			// Successful, so render
			res.render('user_profilepic', {
				title: 'Update Profile Pic',
				user: found_user
			});
		});
};

// Handle profilepic page on POST to DB and S3
exports.profilepic_post = (req, res, next) => {
	// Extract the validation errors from a request.
	const errors = validationResult(req);
	// Get a handle on errors.array() array.
	const errorsArray = errors.array();

	const ysFile = req.file;
	const key = (req.user.username + '/' + ysFile.originalname);
	const oldKey = (req.user.username + '/' + req.user.profilepic);
	S3.params.Body = ysFile.buffer;
	S3.params.ContentType = ysFile.mimetype;
	S3.params.Key = key;
	S3.deleteParams.Key = oldKey;

	let user = new User({
		profilepic: ysFile.originalname,
		_id: req.params.id
	});

	// -- Custom Validation -- //
	// Check if passwords match or not.
	if (ysFile.originalname === undefined) {
		// Passwords do not match. Create and push an error message.
		errorsArray.push({ msg: 'Please select an image before you click submit.' });
	}

	if (errorsArray.length > 0) {
		// There are errors. Render the form again with sanitized values/error messages.
		res.render('user_profilepic', {
			title: 'Update Profile',
			user: user,
			errors: errorsArray
		});

	} else {
		User
			.findByIdAndUpdate(req.params.id, user, {}, (err, theuser) => {
				if (err) return next(err);
				if (theuser === null) {
					let err = new Error('User not found');
					err.status = 404;
					return next(err);
				}

				// Delete old profile picture from S3
				S3.s3Client.deleteObject(S3.deleteParams, (err, data) => {
					if (err) debug(err, err.stack);
					else {
						debug(`Deleting ${S3.deleteParams.Key} in ${process.env.S3_BUCKET} in S3`);
						debug(data);
					}
				});

				// Upload new profile pic to S3 bucket
				S3.s3Client.putObject(S3.params, (err, data) => {
					if (err) debug(err, err.stack);
					else {
						debug(`Posting ${S3.params.Key} to ${process.env.S3_BUCKET} in S3`);
						debug(data);
					}
				});

				// Successful - redirect to user detail page.
				res.redirect('/users/' + theuser._id);
			});
	}
};

exports.profilepic_delete = (req, res, next) => {
	const oldKey = (req.user.username + '/' + req.user.profilepic);
	S3.deleteParams.Key = oldKey;

	let user = new User({
		profilepic: undefined,
		_id: req.params.id
	});

	try {
		// TODO - Figure out why this isn't deleting image name from DB
		User.findByIdAndDelete(req.params.id, user, {}, (err, theuser) => {
			if (err) return next(err);
			if (theuser === null) {
				let err = new Error('User not found');
				err.status = 404;
				return next(err);
			}

			// Delete old profile picture from S3
			S3.s3Client.deleteObject(S3.deleteParams, (err, data) => {
				if (err) debug(err, err.stack);
				else {
					debug(`Deleting ${S3.deleteParams.Key} in ${process.env.S3_BUCKET} in S3`);
					debug(data);
				}
			});

			res.redirect('/users/' + theuser._id + '/profilepic');
		});
	}
	catch (err) {
		res.render('error');
	}
};

exports.facebook_auth = passport.authenticate('facebook', { scope : ['email'] });

exports.facebook_callback = passport.authenticate('facebook', {
	successRedirect: '/',
	failureRedirect: '/users/login',
	failureFlash: true
});

exports.twitter_auth = passport.authenticate('twitter', { scope : ['email'] });

exports.twitter_callback = passport.authenticate('twitter', {
	successRedirect: '/',
	failureRedirect: '/users/login',
	failureFlash: true
});

exports.connect_local_get = (req, res) => {
	// res.render('/users/connect_local', { message: req.flash('Connecting your local account.') });
	res.render('/users/connect_local');
};

exports.connect_local_post = passport.authenticate('local-signup', {
	successRedirect: '/', // redirect to the secure profile section
	failureRedirect: '/users/connect_local', // redirect back to the signup page if there is an error
	failureFlash: true // allow flash messages
});

exports.connect_facebook_get = passport.authorize('facebook', { scope : ['email'] });

exports.connect_facebook_callback = passport.authorize('facebook', {
	successRedirect: '/',
	failureRedirect: '/users/connect_local'
});

exports.connect_twitter_get = passport.authorize('twitter', { scope : ['email'] }, (req, res) => {
	res.send(200);
});

exports.connect_twitter_callback = passport.authorize('facebook', {
	successRedirect: '/',
	failureRedirect: '/users/connect_local'
});

exports.unlink_local_get = (req, res) => {
	const user = req.user;
	user.local.email = undefined;
	user.local.password = undefined;
	user.save(() => {
		res.redirect('/');
	});
};

exports.unlink_facebook_get = (req, res) => {
	const user = req.user;
	user.facebook.token = undefined;
	user.facebook.id = undefined;
	user.facebook.email = undefined;
	user.facebook.name = undefined;

	user.save(() => {
		res.redirect('/');
	});
};

exports.unlink_twitter_get = (req, res) => {
	const user = req.user;
	user.twitter.token = undefined;
	user.twitter.id = undefined;
	user.twitter.displayName = undefined;
	user.twitter.username = undefined;

	user.save(() => {
		res.redirect('/');
	});
};

// Get Delete Account page.
exports.delete_account_get = (req, res, next) => {
	debug(`Getting user ${req.user.username}'s delete account page.`);
	User
		.findById(req.params.id)
		.exec()
		.catch((err, found_user) => {
			if (err) return next(err);
			if (found_user === null) {
				let err = new Error('User not found');
				err.status = 404;
				return next(err);
			}
		})
		.then(found_user => {
		// Successful, so render
			res.render('delete_account', {
				title: 'Delete Account',
				user: found_user
			});
		});
};
