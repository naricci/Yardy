const async = require('async');
const AWS = require('aws-sdk');
const debug = require('debug')('yardy:yardsale.controller');
const { check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const multer = require('multer');
// Models
const User = require('../models/user');
const Yardsale = require('../models/yardsale');

// Display list of all yardsales.
exports.yardsale_list = (req, res, next) => {
	Yardsale
		.find()
		.populate('user')
		.sort([['date', 'ascending']])
		.exec((err, list_yardsales) => {
			if (err) {
				return next(err);
			}
			// Successful, so render
			res.render('yardsale_list', {
				title: 'Yard Sale Search Results',
				yardsale_list: list_yardsales
			});
		});
};

// Display detail page for a specific yardsale.
exports.yardsale_detail = (req, res, next) => {
	async.parallel({
		yardsale: (callback) => {
			Yardsale
				.findById(req.params.id)
				.populate('user')
				.exec(callback);
		},
		user: (callback) => {
			User
				.findById(req.user._id)
				.exec(callback);
		},
	}, (err, results) => {
		if (err) return next(err); // Error in API usage.
		if (results.yardsale === null) { // No yardsales.
			err = new Error('Yardsale not found');
			err.status = 404;
			return next(err);
		}
		if (results.user === null) { // No users.
			err = new Error('User not found');
			err.status = 404;
			return next(err);
		}
		// Successful, so render.
		res.render('yardsale_detail', {
			title: 'Yardsale Details',
			yardsale: results.yardsale,
			user: results.user
		});
	});
};

// Display yardsale create form on GET.
exports.yardsale_create_get = (req, res, next) => {
	User
		.findById(req.user._id, (err, results) => {
			if (err) return next(err);
			if (results.user === null) { // No results.
				let err = new Error('User not found.');
				err.status = 404;
				return next(err);
			}
			res.render('yardsale_form', { title: 'Create Yardsale', user: results.user });
		});
};

// Handle Yardsale create on POST.
exports.yardsale_create_post = [
	// Validate fields
	check('phone')
		.isMobilePhone('en-US')
		.withMessage('Please enter a valid 10-digit phone number.'),
	check('zipcode')
		.isPostalCode('US')
		.withMessage('Please enter a valid 5-digit zip code'),
	check('date')
		.optional({ checkFalsy: true }).isISO8601()
		.withMessage('Please enter a valid date')
		.isAfter()
		.withMessage('Please select a date that hasn\'t occurred yet.'),

	// // Sanitize fields.
	sanitizeBody('phone').toInt(),
	sanitizeBody('zipcode').toString(),
	sanitizeBody('date').toDate(),

	// Process request after validation and sanitization.
	(req, res, next) => {

		// debug('Bucket Path: ' + process.env.S3_BUCKET + '/' + folder + file);

		// Extract the validation errors from a request.
		let errors = validationResult(req);

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.render('yardsale_form', { title: 'Create Yardsale', yardsale: req.body, errors: errors.array() });
			// return;
		}
		else {
			// Data from form is valid.
			// Create an Yardsale object with escaped and trimmed data.
			let yardsale = new Yardsale({
				phone: req.body.phone,
				address: req.body.address,
				address2: req.body.address2,
				city: req.body.city,
				state: req.body.state,
				zipcode: req.body.zipcode,
				date: req.body.date,
				starttime: req.body.starttime,
				endtime: req.body.endtime,
				description: req.body.description,
				user: req.user._id,
				imagename: req.body.imagename
			});

			yardsale.save((err) => {
				if (err) return next(err);

				// Upload yardsale image to S3 Bucket
				// s3.putObject(params, (err, data) => {
				// 	if (err) debug('Error: ', err);
				// 	else debug(data);
				// });

				// Successful - redirect to new yardsale record.
				debug(yardsale);
				res.redirect('/catalog/yardsale/'+yardsale._id);
			});
		}
	}
];

// TODO Fix issue grabbing user data on GET
// Display Yardsale delete form on GET.
exports.yardsale_delete_get = (req, res, next) => {
	async.parallel({
		yardsale: (callback) => {
			Yardsale
				.findById(req.params.id)
				.populate('user')
				.exec(callback);
		},
		user: (callback) => {
			User
				.find({ 'user': req.user._id }, 'username email firstName lastName phone profilepic')
				.exec(callback);
		},
	}, (err, results) => {
		if (err) return next(err);
		if (results.yardsale === null) { // No results.
			res.redirect('/catalog/yardsales');
		}

		// Successful, so render.
		res.render('yardsale_delete', {
			title: 'Delete Yardsale',
			yardsale: results.yardsale,
			user: results.user
		});
	});
};

// Handle Yardsale delete on POST.
exports.yardsale_delete_post = (req, res, next) => {
	async.parallel({
		yardsale: (callback) => {
			Yardsale
				.findById(req.body.yardsaleid)
				.exec(callback);
		},
	}, (err, results) => {
		if (err) { return next(err); }
		// Success.
		if (results.yardsale.length === 1) {
			// yardsale has books. Render in same way as for GET route.
			res.render('yardsale_delete', {
				title: 'Delete Yardsale',
				yardsale: results.yardsale
			});
			return;
		}
		else {
			// Delete yardsale object and redirect to the list of yardsales.
			Yardsale
				.findByIdAndDelete(req.body.yardsaleid, function deleteYardsale(err) {
					if (err) { return next(err); }
					// Success - go to yardsale list.
					res.redirect('/catalog/yardsales');
				});
		}
	});
};

// Display Yardsale update form on GET.
exports.yardsale_update_get = (req, res, next) => {
	Yardsale
		.findById(req.params.id)
		.populate('user')
		.exec()
		.catch((err, yardsale) => {
			if (err) { return next(err); }
			if (yardsale === null) { // No results.
				let err = new Error('Yardsale not found.');
				err.status = 404;
				return next(err);
			}
		})
		.then((yardsale) => {
			// Success.
			res.render('yardsale_edit', {
				title: 'Update Yardsale',
				yardsale: yardsale
			});
		});
};

// Handle Yardsale update on POST.
exports.yardsale_update_post = [

	// Validate form fields.
	check('phone')
		.isMobilePhone('en-US')
		.withMessage('Please enter a valid 10-digit phone number.')
		.trim(),
	check('zipcode')
		.isPostalCode('US')
		.withMessage('Please enter a valid 5-digit zip code')
		.trim(),
	check('date')
		.isAfter()
		.withMessage('Please select a date that hasn\'t occurred yet.')
		.trim(),

	// Sanitize fields.
	sanitizeBody('phone').toInt(),
	sanitizeBody('zipcode').toString(),
	sanitizeBody('date').toDate(),
	sanitizeBody('imagename').toString(),

	// Process request after validation and sanitization.
	(req, res, next) => {

		// Extract the validation errors from a request.
		const errors = validationResult(req);

		var file = req.file;
		// Create Yardsale object with escaped and trimmed data (and the old id!)
		var yardsale = new Yardsale({
			firstName: req.body.firstname,
			lastName: req.body.lastname,
			username: req.body.username,
			phone: req.body.phone,
			address: req.body.address,
			address2: req.body.address2,
			city: req.body.city,
			state: req.body.state,
			zipcode: req.body.zipcode,
			date: req.body.date,
			starttime: req.body.starttime,
			endtime: req.body.endtime,
			description: req.body.description,
			imagename: req.body.imagename,
			_id: req.params.id
		});

		const key = (req.user.username + '/' + req.body.imagename);
		const s3 = new AWS.S3({
			apiVersion: '2006-03-01',
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			region: process.env.S3_BUCKET_REGION
		});
		const params = {
			ACL: 'public-read',
			Body: file.buffer,
			Bucket: process.env.S3_BUCKET,
			ContentType: file.mimetype,
			Key: key,
			ServerSideEncryption: 'AES256'
		};

		if (!errors.isEmpty()) {
			// There are errors. Render the form again with sanitized values and error messages.
			res.render('yardsale_form', {
				title: 'Update Yardsale',
				yardsale: yardsale,
				errors: errors.array() });
			return;
		}
		else {
			// Data from form is valid. Update the yardsale record.
			Yardsale
				.findByIdAndUpdate(req.params.id, yardsale, {}, (err, theyardsale) => {
					if (err) return next(err);

					// S3 Image upload
					s3.putObject(params, (err, data) => {
						if (err) debug('Error: ', err);
						else {
							debug(`Posting ${params.Key} to ${process.env.S3_BUCKET} in S3`);
							debug(data);
						}
					});
					// Successful - redirect to yardsale detail page.
					res.redirect('/catalog/yardsale/'+theyardsale._id);
					// res.redirect('/users/'+theyardsale.user._id);
				});
		}
	}
];

//////////for search
exports.all_yardsales = function (req, res) {
	console.log('All Yardsales Unsorted');

	Yardsale.find()
		.exec()
		.then (index => {
			res.send(index);
		}).catch(err => {
			res.status(500).send({
				message: err.message
			});
		});
};

exports.all_yardsales_sorted = function (req, res) {
	console.log('All Yardsales Sorted');

	Yardsale.find()
		.sort([['date', 'ascending']])
		.exec()
		.then (index => {
			res.send(index);
		}).catch(err => {
			res.status(500).send({
				message: err.message
			});
		});
};
