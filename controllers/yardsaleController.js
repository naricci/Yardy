const async = require('async');
const { body, check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const debug = require('debug')('yardy:yardsale.controller');

// AWS Setup
const AWS = require('aws-sdk');
const bucketName = 'yardy123' || process.env.S3_BUCKET;
const bucketRegion = 'us-east-1' || process.env.S3_BUCKET_REGION;
AWS.config.update({
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	accessKey: process.env.AWS_ACCESS_KEY_ID,
	region: bucketRegion
});
// AWS.config.apiVersions = {
// 	s3: '2006-03-01'
// };
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Models
const Yardsale = require('../models/yardsale');
const User = require('../models/user');

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
				title: 'Yardsales',
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
				.findById(req.params.id)
				.exec(callback);
		},
	}, (err, results) => {
		if (err) { return next(err); } // Error in API usage.
		if (results.yardsale == null) { // No results.
			err = new Error('Yardsale not found');
			err.status = 404;
			return next(err);
		}
		// Successful, so render.
		res.render('yardsale_detail', { title: 'Yardsale Details', yardsale: results.yardsale, user: results.user });
	});
};

// Display yardsale create form on GET.
exports.yardsale_create_get = (req, res, next) => {
	res.render('yardsale_form', { title: 'Create Yardsale' });
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

	// Validate fields.
	// body('date', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

	// // Sanitize fields.
	sanitizeBody('phone').toInt(),
	sanitizeBody('zipcode').toString(),
	sanitizeBody('date').toDate(),

	// Process request after validation and sanitization.
	(req, res, next) => {

		// S3 Bucket Details
		const folder = (req.user.username + '/');
		const file = (req.body.imagename);
		const params = {
			Bucket: bucketName,
			Key: (folder + file),
			ACL: 'public-read',
			Body: file
		};
		debug('Folder name: ' + folder);
		debug('File: ' + file);

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

			// TODO - Add async function to push yardsale id to user's yardsales array

			yardsale.save((err) => {
				if (err) { return next(err); }

				// Upload yardsale image to S3 Bucket
				s3.putObject(params, (err, data) => {
					if (err) {
						console.log('Error: ', err);
					} else {
						debug(data);
					}
				});

				// Successful - redirect to new yardsale record.
				debug(yardsale);
				res.redirect('/catalog/yardsale/'+yardsale._id);
			});
		}
	}
];

// Display Yardsale delete form on GET.
exports.yardsale_delete_get = (req, res, next) => {
	async.parallel({
		yardsale: (callback) => {
			Yardsale.findById(req.params.id)
				.populate('user')
				.exec(callback);
		},
	}, (err, results) => {
		if (err) { return next(err); }
		if (results.yardsale == null) { // No results.
			res.redirect('/catalog/yardsales');
		}
		debug('Yardsale id: ' + req.params.id + ' deleted.');
		// Successful, so render.
		res.render('yardsale_delete', { title: 'Delete Yardsale', yardsale: results.yardsale });
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
			res.render('yardsale_delete', { title: 'Delete Yardsale', yardsale: results.yardsale });
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
		.findById(req.params.id, (err, yardsale) => {
			if (err) { return next(err); }
			if (yardsale == null) { // No results.
				let err = new Error('Yardsale not found.');
				err.status = 404;
				return next(err);
			}
			// Success.
			res.render('yardsale_form', { title: 'Update Yardsale', yardsale: yardsale });
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

	// Process request after validation and sanitization.
	(req, res, next) => {

		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create Yardsale object with escaped and trimmed data (and the old id!)
		let yardsale = new Yardsale(
			{
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
				_id: req.params.id
			}
		);

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
					if (err) { return next(err); }
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
