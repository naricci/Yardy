const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const passport = require('passport');
const async = require('async');
const debug = require('debug')('yardy:user.controller');
const User = require('../models/user');
// var mongoose = require('mongoose');

// Display detail page for a specific user.
exports.user_profile = [
	// isPageOwnedByUser,

	(req, res, next) => {

		if (req.params && req.params.id) {
			// let id = mongoose.Types.ObjectId(req.user._id);
			debug('Gettting user id: ' + req.user._id.toString());

			User
				.findById(req.params.id)
				.exec((err, found_user) => {
					if (err) {
						return next(err);
					}
					if (found_user == null) {
						let err = new Error('User not found');
						err.status = 404;
						return next(err);
					}
					// Successful, so render
					res.render('user_profile', {
						title: 'User Profile',
						user: found_user
					});
				});
		}
	}
];

// Display login form on GET.
exports.login_get = [
	isAlreadyLoggedIn,

	function(req, res, next) {
		var messages = extractFlashMessages(req);
		res.render('user_login', {
			title: 'Login',
			errors: messages.length > 0 ? messages : null
		});
	}
];

// Display warning page on GET.
exports.warning = [
	function(req, res, next) {
		var messages = extractFlashMessages(req);
		res.render('user_warning', {
			title: 'Sorry!',
			errors: messages.length > 0 ? messages : null
		});
	}
];

// Handle login form on POST
exports.login_post = [
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login',
		failureFlash: true
	})
];

// Handle logout on GET.
exports.logout_get = [
	function(req, res, next) {
		req.logout();
		req.session.destroy(function(err) {
			res.redirect('/');
		});
	}
];

// Display register form on GET.
exports.register_get = [
	isAlreadyLoggedIn,

	// Continue processing.
	function(req, res, next) {
		// 'user_form'
		res.render('user_form', {
			title: 'Create User'
		});
	}
];

// Handle register on POST.
exports.register_post = [
	// Validate form fields.
	body('username', 'Username must be at least 3 characters long.')
		.isLength({ min: 4 })
		.trim(),
	body('email', 'Please enter a valid email address.')
		.isEmail()
		.trim(),
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
		var errors = validationResult(req);

		// Get a handle on errors.array() array,
		// so we can push our own error messages into it.
		var errorsArray = errors.array();

		// Create a user object with escaped and trimmed data.
		var user = new User({
			username: req.body.username,
			firstName: req.body.firstname,
			lastName: req.body.lastname,
			email: req.body.email,
			phone: req.body.phone,
			address: req.body.address,
			address2: req.body.address2,
			city: req.body.city,
			state: req.body.state,
			zipcode: req.body.zipcode
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
					if (err) {
						return next(err);
					}
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
							if (err) {
								return next(err);
							}
							console.log('User Created Successfully\n' + user);
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
exports.update_get = [
	// isPageOwnedByUser,

	function(req, res, next) {
		// TODO Figure out why Id is not being cast correctly
		// ERROR - Cast to ObjectId failed for value "undefined" at path "_id" for model "Users"
		// var id = req.params.id;
		// var id = mongoose.Types.ObjectId(req.user._id);
		User
			.findById(req.params.id)
			.exec((err, found_user) => {
				if (err) {
					return next(err);
				}
				if (found_user == null) {
					let err = new Error('User not found');
					err.status = 404;
					return next(err);
				}
				// Successful, so render
				res.render('user_form', {
					title: 'Update User',
					user: found_user,
					is_update_form: true
				});
			});
	}
];

// Handle update on POST.
exports.update_post = [
	// Validate fields.
	body('username', 'Username must be at least 3 characters long.')
		.isLength({ min: 4, max: 25 })
		.trim(),
	body('email', 'Please enter a valid email address.')
		.isEmail()
		.trim(),
	body('password', 'Password must be between 4-32 characters long.')
		.isLength({ min: 4, max: 32 })
		.trim(),
	body('cpassword', 'Password must be between 4-32 characters long.')
		.isLength({ min: 4, max: 32 })
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
		var errors = validationResult(req);

		// Get a handle on errors.array() array.
		var errorsArray = errors.array();

		// Create a user object with escaped and trimmed data and the old _id!
		var user = new User({
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
			var filteredErrorsArray = [];
			errorsArray.forEach(errorObj => {
				if (
					!(errorObj.param === 'password' || errorObj.param === 'cpassword')
				) {
					filteredErrorsArray.push(errorObj);
				}
			});
			// Assign filtered array back to original array.
			errorsArray = filteredErrorsArray;
		}

		if (errorsArray.length > 0) {
			// There are errors. Render the form again with sanitized values/error messages.
			res.render('user_form', {
				title: 'Update Account',
				user: user,
				errors: errorsArray,
				is_update_form: true
			});
			return;
		} else {
			if (req.params && req.params.id) {
				// let id = mongoose.Types.ObjectId(req.user._id);
				debug('Updating user id: ' + req.user._id.toString());
				// Data from form is valid. Update the record.
				User
					.findByIdAndUpdate(req.params.id, user, {}, function(err, theuser) {
						if (err) {
							return next(err);
						}
						// Successful - redirect to user detail page.
						res.redirect('/users/'+theuser._id);
					});
			}
		}
	}
];

// Display reset password form on GET.
exports.reset_get = [
	isAlreadyLoggedIn,

	function(req, res, next) {
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
	body('username', 'Username must be at least 3 characters long.')
		.isLength({ min: 4 })
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
		var errors = validationResult(req);

		// Get a handle on errors.array() array.
		var errorsArray = errors.array();

		// Create a user object with escaped and trimmed data.
		var user = new User({
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
						if (err) {
							return next(err);
						}
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
		var errors = validationResult(req);

		// Get a handle on errors.array() array.
		var errorsArray = errors.array();

		// Create a user object containing only id field, for now.
		// We need to use old _id, which is coming from found_user passed in the first step.
		var user = new User({
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
					function(callback) {
						User.findById(req.body.userid).exec(callback);
					},
					function(found_user, callback) {
						// This step is required to keep user role unchanged.
						// user.role = found_user.role;
						User.findByIdAndUpdate(req.body.userid, user, {}).exec(callback);
					}
				],
				function(err, theuser) {
					if (err) {
						return next(err);
					}
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

// Display favorites page on GET
exports.favorites_get = [
	// isPageOwnedByUser,

	function(req, res, next) {
		User
			.findById(req.params.id)
			.exec((err, found_user) => {
				if (err) {
					return next(err);
				}
				if (found_user == null) {
					let err = new Error('User not found');
					err.status = 404;
					return next(err);
				}
				// Successful, so render
				res.render('user_favorites', {
					title: 'Manage Favorites',
					user: found_user,
					is_update_form: true
				});
			});
	}
];

// Handle favorites page on POST
exports.favorites_post = [
	// TODO Finish writing function to POST/PUT favorites
];

// -- Helper functions -- //
// Extract flash messages from req.flash and return an array of messages.
function extractFlashMessages(req) {
	var messages = [];
	// Check if flash messages was sent. If so, populate them.
	var errorFlash = req.flash('error');
	var successFlash = req.flash('success');

	// Look for error flash.
	if (errorFlash && errorFlash.length) messages.push({ msg: errorFlash[0] });

	// Look for success flash.
	if (successFlash && successFlash.length)
		messages.push({ msg: successFlash[0] });

	return messages;
}

// Function to prevent user who already logged in from
// accessing login and register routes.
function isAlreadyLoggedIn(req, res, next) {
	if (req.user && req.isAuthenticated()) {
		res.redirect('/');
	} else {
		next();
	}
}

// Function that confirms that user is logged in and is the 'owner' of the page.
function isPageOwnedByUser(req, res, next) {
	if (req.user && req.isAuthenticated()) {
		if (req.user._id.toString() === req.params.id.toString()) {
			// User's own page. Allow request.
			next();
		} else {
			// Deny and redirect.
			res.redirect('/');
		}
	} else {
		// Not authenticated. Redirect.
		res.redirect('/');
	}
}

// Function sends a JSON response
function sendJSONresponse(res, status, content) {
	res.status(status);
	res.json(content);
}

