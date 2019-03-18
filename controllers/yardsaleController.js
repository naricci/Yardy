const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
const Yardsale = require('../models/yardsale');
const debug = require('debug')('yardy:yardsale.controller');

// Display list of all yardsales.
exports.yardsale_list = function(req, res, next) {
	Yardsale.find()
		.sort([['date', 'ascending']])
		.exec(function(err, list_yardsales) {
			if (err) {
				return next(err);
			}
			// Successful, so render
			res.render('yardsale_list', {
				title: 'Yardsale List',
				yardsale_list: list_yardsales
			});
		});
};

// Display detail page for a specific yardsale.
exports.yardsale_detail = function(req, res, next) {
	async.parallel({
		yardsale: function (callback) {
			Yardsale
				.findById(req.params.id)
				.exec(callback);
		},
	}, function (err, results) {
		if (err) { return next(err); } // Error in API usage.
		if (results.yardsale == null) { // No results.
			err = new Error('Yardsale not found');
			err.status = 404;
			return next(err);
		}
		// Successful, so render.
		res.render('yardsale_detail', { title: 'Yardsale Details', yardsale: results.yardsale });
	});
};

// Display yardsale create form on GET.
exports.yardsale_create_get = (req, res, next) => {
	res.render('yardsale_form', { title: 'Create Yardsale' });
};

// Handle Yardsale create on POST.
exports.yardsale_create_post = [

	// Validate fields.
	body('firstname', 'First name must be specified.')
		.isLength({ min: 1 })
		.trim(),
	// .withMessage('First name must be specified.'),
	// 	.isAlphanumeric()
	// 	.withMessage('First name has non-alphanumeric characters.'),
	// body('phone')
	// 	.isLength({ min: 10, max: 10 })
	// 	.trim()
	// 	.withMessage('Please enter a 10-digit phone number.')
	// 	.isNumeric()
	// 	.withMessage('Phone number can only contain numbers.'),
	// body('zipcode')
	// 	.isLength({ min: 5, max: 5 })
	// 	.trim()
	// 	.withMessage('Please enter a 5-digit zip code.')
	// 	.isNumeric()
	// 	.withMessage('Zip code can only contain numbers.'),

	// Sanitize fields.
	sanitizeBody('firstname').trim(),
	// sanitizeBody('phone').trim(),
	// sanitizeBody('zipcode').trim(),
	// sanitizeBody('date').toDate(),

	// Process request after validation and sanitization.
	(req, res, next) => {

		// Extract the validation errors from a request.
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.render('yardsale_form', { title: 'Create Yardsale', yardsale: req.body, errors: errors.array() });
			return;
		}
		else {
			// Data from form is valid.

			// Create an Yardsale object with escaped and trimmed data.
			var yardsale = new Yardsale(
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
					description: req.body.description
				});

			yardsale.save(function (err) {
				if (err) { return next(err); }
				console.log('User Created Successfully\n' + yardsale._id);
				// Successful - redirect to new yardsale record.
				res.redirect('/catalog/yardsale/'+yardsale._id);
			});
		}
	}
];

// Display Yardsale delete form on GET.
exports.yardsale_delete_get = function (req, res, next) {
	async.parallel({
		yardsale: function (callback) {
			Yardsale.findById(req.params.id).exec(callback);
		},
	}, function (err, results) {
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
exports.yardsale_delete_post = function (req, res, next) {
	async.parallel({
		yardsale: function (callback) {
			Yardsale
				.findById(req.body.yardsaleid)
				.exec(callback);
		},
	}, function (err, results) {
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
exports.yardsale_update_get = function (req, res, next) {

	Yardsale
		.findById(req.params.id, function (err, yardsale) {
			if (err) { return next(err); }
			if (yardsale == null) { // No results.
				var err = new Error('Yardsale not found.');
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
	body('firstname').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
		.isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
	body('lastname').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
		.isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
	body('date', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

	// Sanitize fields.
	sanitizeBody('firstname').trim().escape(),
	sanitizeBody('lastname').trim().escape(),
	sanitizeBody('date').toDate(),

	// Process request after validation and sanitization.
	(req, res, next) => {

		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create Yardsale object with escaped and trimmed data (and the old id!)
		var yardsale = new Yardsale(
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
			res.render('yardsale_form', { title: 'Update Yardsale', yardsale: yardsale, errors: errors.array() });
			return;
		}
		else {
			// Data from form is valid. Update the yardsale record.
			Yardsale.findByIdAndUpdate(req.params.id, yardsale, {}, function (err, theyardsale) {
				if (err) { return next(err); }
				// Successful - redirect to yardsale detail page.
				res.redirect('/catalog/yardsale/'+theyardsale._id);
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
