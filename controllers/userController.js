const async = require('async');
const debug = require('debug')('yardy:user.controller');
const { body, check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const passport = require('passport');
const S3 = require('../config/s3_config');

// Models
const User = require('../models/user');
const Yardsale = require('../models/yardsale');

// Display detail page for a specific user.
exports.user_profile = (req, res, next) => {
	async.parallel({
		user: (callback) => {
			User
				.findById(req.params.id)
				.exec(callback);
		},
		yardsales: (callback) => {
			Yardsale
				.find({ 'user': req.params.id }, 'date starttime address city state description imagename')
				.sort([['date', 'ascending']])
				.exec(callback);
		},
	}, (err, results) => {
		if (err) { return next(err); } // Error in API usage.
		if (results.user === null) { // No results.
			let err = new Error('User not found');
			err.status = 404;
			return next(err);
		}

		res.render('user_profile', {
			title: 'Your Yard Sales',
			user: results.user,
			yardsales: results.yardsales
		});
	});
};

// Display login form on GET.
exports.login_get = [
	isAlreadyLoggedIn,
	(req, res, next) => {
		let messages = extractFlashMessages(req);
		res.render('user_login', {
			title: 'Login',
			errors: messages.length > 0 ? messages : null
		});
	}
];

// Display warning page on GET.
exports.warning = (req, res, next) => {
	let messages = extractFlashMessages(req);
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
exports.logout_get = (req, res, next) => {
	req.logout();
	req.session.destroy((err) => {
		res.redirect('/');
	});
};

// Display register form on GET.
exports.register_get = [
	isAlreadyLoggedIn,
	// Continue processing.
	(req, res, next) => {
		// 'user_form'
		res.render('user_form', {
			title: 'Create User'
		});
	}
];

// Handle register on POST.
exports.register_post = [
	// Validate form fields.
	body('username', 'Username must be between 4-32 characters long.')
		.isLength({ min: 4, max: 32 })
		.trim(),
	body('email', 'Please enter a valid email address.')
		.isEmail()
		.trim(),
	body('password', 'Password must be between 4-25 characters long.')
		.isLength({ min: 4, max: 25 })
		.trim(),
	body('cpassword', 'Password must be between 4-25 characters long.')
		.isLength({ min: 4, max: 25 })
		.trim(),

	// Sanitize fields with wildcard operator.
	sanitizeBody('*')
		.trim()
		.escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		let errors = validationResult(req);
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

		if (errorsArray.length > 0) {
			// There are errors. Render the form again with sanitized values/error messages.
			res.render('user_form', {
				title: 'Create User',
				user: user,
				errors: errorsArray
			});
			return;
		} else {
			// Data from form is valid.

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
	}
];

// Display update form on GET.
exports.update_get = (req, res, next) => {
	User
		.findById(req.params.id)
		.exec((err, found_user) => {
			if (err) return next(err);
			if (found_user === null) {
				let err = new Error('User not found');
				err.status = 404;
				return next(err);
			}
			// Successful, so render
			res.render('user_form', {
				title: 'Update Profile',
				user: found_user,
				is_update_form: true
			});
		});
};

// Handle update on POST.
exports.update_post = [
	// Validate fields.
	body('email', 'Please enter a valid email address.')
		.isEmail()
		.trim(),
	body('password', 'Password must be between 4-25 characters long.')
		.isLength({ min: 4, max: 25 })
		.trim(),
	body('cpassword', 'Password must be between 4-25 characters long.')
		.isLength({ min: 4, max: 25 })
		.trim(),
	body('zipcode', 'Zip Code must be 5 characters long.')
		.isLength({ min: 5, max: 5 })
		.trim(),

	// Sanitize fields with wildcard operator.
	sanitizeBody('*')
		.trim()
		.escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		let errors = validationResult(req);
		// Get a handle on errors.array() array.
		let errorsArray = errors.array();

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
			return;
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
	}
];

// Display reset password form on GET.
exports.reset_get = [
	isAlreadyLoggedIn,
	(req, res, next) => {
		res.render('user_reset', {
			title: 'Reset Password',
			is_first_step: true
		});
	}
];

// Handle reset password on POST (1st step).
exports.reset_post = [
	// First step of the password reset process.
	// Take username and email from form, and try to find a matching user.
	// Validate fields.
	body('username', 'Username must be between 4-32 characters long.')
		.isLength({ min: 4, max: 32 })
		.trim(),
	body('email', 'Please enter a valid email address.')
		.isEmail()
		.trim(),

	// Sanitize fields with wildcard operator.
	sanitizeBody('*')
		.trim()
		.escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
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
			return;
		} else {
			// Data from form is valid.

			// Check if User exists.
			User
				.findOne({ username: req.body.username, email: req.body.email })
				.exec(
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
								errors: [
									{
										msg:
										'The user does not exist or credentials did not match a user. Try again.'
									}
								]
							});
						}
					}
				);
		}
	}
];

// Handle reset password on POST (2nd step).
exports.reset_post_final = [
	// Second and the final step of the password reset process.
	// Take userid, password and password_confirm fields from form,
	// and update the User record.
	body('password', 'Password must be between 4-32 characters long.')
		.isLength({ min: 4, max: 32 })
		.trim(),
	body('cpassword', 'Password must be between 4-32 characters long.')
		.isLength({ min: 4, max: 32 })
		.trim(),

	// Sanitize fields with wildcard operator.
	sanitizeBody('*')
		.trim()
		.escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
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
			return;
		} else {
			// Data from form is valid.

			// Passwords match. Set password.
			user.setPassword(req.body.password);

			// Update the record.
			async.waterfall(
				[
					(callback) => {
						User
							.findById(req.body.userid)
							.exec(callback);
					},
					(found_user, callback) => {
						User
							.findByIdAndUpdate(req.body.userid, user, {})
							.exec(callback);
					}
				],
				(err, theuser) => {
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
	}
];

// Display profile picture update page on GET
exports.profilepic_get = (req, res, next) => {
	debug(`Getting user ${req.user.username}'s profilepic page`);
	User
		.findById(req.params.id)
		.exec((err, found_user) => {
			if (err) return next(err);
			if (found_user == null) {
				let err = new Error('User not found');
				err.status = 404;
				return next(err);
			}
			// Successful, so render
			res.render('user_profilepic', {
				title: 'Update Profile Pic',
				user: found_user
			});
		});
};

// Handle profilepic page on POST to DB and S3
exports.profilepic_post = [
	// Validate form fields.
	check('profilepic')
		.isLength({max: 100})
		.withMessage('Image name cannot be longer than 100 characters long.')
		.trim(),
	// Sanitize fields.
	sanitizeBody('profilepic').toString(),

	(req, res, next) => {
		// Extract the validation errors from a request.
		var errors = validationResult(req);
		// Get a handle on errors.array() array.
		var errorsArray = errors.array();

		const ysFile = req.file;
		const key = (req.user.username + '/' + ysFile.originalname);
		S3.params.Body = ysFile.buffer;
		S3.params.ContentType = ysFile.mimetype;
		S3.params.Key = key;

		let user = new User({
			profilepic: ysFile.originalname,
			_id: req.params.id
		});

		if (errorsArray.length > 0) {
			// There are errors. Render the form again with sanitized values/error messages.
			res.render('user_form', {
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
					// S3 Image upload
					S3.s3Client.putObject(S3.params, (err, data) => {
						if (err) debug('Error: ', err);
						else {
							debug(`Posting ${S3.params.Key} to ${process.env.S3_BUCKET} in S3`);
							debug(data);
						}
					});
					// Successful - redirect to user detail page.
					res.redirect('/users/' + theuser._id);
				});
		}
	}
];

// Display favorites page on GET
exports.favorites_get = (req, res, next) => {
	User
		.findById(req.params.id)
		.exec((err, found_user) => {
			if (err) return next(err);
			if (found_user === null) {
				let err = new Error('User not found');
				err.status = 404;
				return next(err);
			}
			// Successful, so render
			res.render('user_favorites', {
				title: 'Manage Favorites',
				user: found_user,
			});
		});
};

// Handle favorites page on POST
exports.favorites_post = [
	// TODO Finish writing function to POST/PUT favorites
];

// -- Helper functions -- //
// Extract flash messages from req.flash and return an array of messages.
function extractFlashMessages(req) {
	let messages = [];
	// Check if flash messages was sent. If so, populate them.
	let errorFlash = req.flash('error');
	let successFlash = req.flash('success');

	// Look for error flash.
	if (errorFlash && errorFlash.length) messages.push({ msg: errorFlash[0] });

	// Look for success flash.
	if (successFlash && successFlash.length)
		messages.push({ msg: successFlash[0] });

	return messages;
}

/*** Helper Functions ***/
// Function to prevent user who already logged in from
// accessing login and register routes.
function isAlreadyLoggedIn(req, res, next) {
	if (req.user && req.isAuthenticated())
		res.redirect('/');
	else next();
}

// Function sends a JSON response
function sendJSONresponse(res, status, content) {
	res.status(status);
	res.json(content);
}

// Function that returns the file extension of a filename as a string.
function getFileExtension(filename) {
	// return filename.split('.').pop();
	let ext = /^.+\.([^.]+)$/.exec(filename);
	return ext === null ? '' : ext[1];
}
