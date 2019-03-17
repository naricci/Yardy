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
	body('firstname').isLength({ min: 1 })
		.trim()
		.withMessage('First name must be specified.')
		.isAlphanumeric()
		.withMessage('First name has non-alphanumeric characters.'),
	body('phone')
		.isLength({ min: 10, max: 10 })
		.trim()
		.withMessage('Please enter a 10-digit phone number.')
		.isNumeric()
		.withMessage('Phone number can only contain numbers.'),
	body('zipcode')
		.isLength({ min: 5, max: 5 })
		.trim()
		.withMessage('Please enter a 5-digit zip code.')
		.isNumeric()
		.withMessage('Zip code can only contain numbers.'),
	// Sanitize fields.
	sanitizeBody('date').toDate(),

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
				// Successful - redirect to new yardsale record.
				res.redirect('/catalog/yardsale/'+yardsale._id);
			});
		}
	}
];


//////////for search
module.exports.all_yardsales = function (req, res) {
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

module.exports.all_yardsales_sorted = function (req, res) {
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
