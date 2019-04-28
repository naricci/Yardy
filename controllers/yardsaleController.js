const async = require('async');
const debug = require('debug')('yardy:yardsale.controller');
const { body, check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const S3 = require('../config/s3_config');
// Models
const User = require('../models/user');
const Yardsale = require('../models/yardsale');

// Display list of all yardsales.
exports.yardsale_list = (req, res, next) => {
	var params = req.body.address;
	if (params === undefined || params === null || params === '') {
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
	}
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
		.findById(req.params.id)
		.exec()
		.catch((err, results) => {
			if (err) return next(err);
			if (results === null) { // No results.
				let err = new Error('User not found.');
				err.status = 404;
				return next(err);
			}
		})
		.then(() => {
			res.render('yardsale_form', {
				title: 'Create Yardsale'
			});
		});
};

// Handle Yardsale create on POST.
exports.yardsale_create_post = [
	// Validate fields
	body('phone', 'Please enter a 10-digit phone number.').isLength({ max: 10 }).trim(),
	// check('phone')
	// 	// .isMobilePhone('en-US')
	// 	.isLength({ min: 10, max: 10 })
	// 	.withMessage('Please enter a 10-digit phone number.')
	// 	.trim()
	// 	.isNumeric()
	// 	.withMessage('Please enter a 10-digit phone number.')
	// 	.trim(),
	// check('zipcode')
	// 	.trim()
	// 	.isPostalCode('US')
	// 	.withMessage('Please enter a valid 5-digit zip code'),
	check('date')
		.optional({ checkFalsy: true }).isISO8601()
		.withMessage('Please enter a valid date')
		.isAfter()
		.withMessage('Please select a date that hasn\'t occurred yet.'),

	// // Sanitize fields.
	// sanitizeBody('phone').trim().escape(),
	// sanitizeBody('zipcode').toString(),
	sanitizeBody('date').toDate(),
	sanitizeBody('imagename').toString(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		let errors = validationResult(req);

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.render('yardsale_form', { title: 'Create Yardsale', yardsale: req.body, errors: errors.array() });
			// return;
		}
		else {
			// Data from form is valid.
			const ysFile = req.file;
			let key = (req.user.username + '/' + ysFile.originalname);
			S3.params.Body = ysFile.buffer;
			S3.params.ContentType = ysFile.mimetype;
			S3.params.Key = key;

			// Create an Yardsale object with escaped and trimmed data.
			let yardsale = new Yardsale({
				phone: req.body.phone,
				address: req.body.address,
				address2: req.body.address2,
				city: req.body.city,
				state: req.body.state,
				zipcode: req.body.zipcode,
				full_address: req.body.address + req.body.city + req.body.state + req.body.zipcode,
				date: req.body.date,
				starttime: req.body.starttime,
				endtime: req.body.endtime,
				description: req.body.description,
				user: req.user._id,
				imagename: ysFile.originalname
			});

			yardsale.save((err) => {
				if (err) return next(err);

				// S3 Image upload
				S3.s3Client.putObject(S3.params, (err, data) => {
					if (err) debug('Error: ', err);
					else {
						debug(`Posting ${S3.params.Key} to ${process.env.S3_BUCKET} in S3`);
						debug(data);
					}
				});

				// Successful - redirect to new yardsale record.
				debug(yardsale);
				res.redirect('/yardsales/'+yardsale._id);
			});
		}
	}
];

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
				.find({ 'user': req.params.id }, 'username email firstName lastName phone profilepic')
				.exec(callback);
		},
	}, (err, results) => {
		if (err) return next(err);
		if (results === null) { // No results.
			res.redirect('/yardsales');
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
		yardsale: (callback) =>{
			Yardsale
				.findById(req.body.id)
				.exec(callback);
		},
	}, (err, results) => {
		if (err) { return next(err); }
		// Success.
		if (results.yardsale.length === 1) {
			// yardsale has books. Render in same way as for GET route.
			res.render('yardsale_delete', { title: 'Delete Yardsale', yardsale: results.yardsale });
			return;
		}
		else {
			// Delete yardsale object and redirect to the list of yardsales.
			Yardsale
				.findByIdAndDelete(req.body.id, function deleteYardsale(err) {
					if (err) { return next(err); }
					// Success - go to yardsale list.
					res.redirect('/yardsales');
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
			if (err) return next(err);
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
				yardsale: yardsale,
				user: yardsale.user
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

		const ysFile = req.file;
		const key = (req.user.username + '/' + ysFile.originalname);
		S3.params.Body = ysFile.buffer;
		S3.params.ContentType = ysFile.mimetype;
		S3.params.Key = key;

		// Create Yardsale object with escaped and trimmed data (and the old id!)
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
			imagename: ysFile.originalname,
			_id: req.params.id
		});

		if (!errors.isEmpty()) {
			// There are errors. Render the form again with sanitized values and error messages.
			res.render('yardsale_edit', {
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
					S3.s3Client.putObject(S3.params, (err, data) => {
						if (err) debug('Error: ', err);
						else {
							debug(`Posting ${S3.params.Key} to ${process.env.S3_BUCKET} in S3`);
							debug(data);
						}
					});
					// Successful - redirect to yardsale detail page.
					res.redirect('/yardsales/'+theyardsale._id);
				});
		}
	}
];
