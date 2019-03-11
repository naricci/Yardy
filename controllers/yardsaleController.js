const Yardsale = require('../models/yardsale.js');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const async = require('async');
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
			Yardsale.findById(req.params.id)
				.exec(callback);
		},
	}, function (err, results) {
		if (err) { return next(err); } // Error in API usage.
		if (results.yardsale == null) { // No results.
			err = new Error('Author not found');
			err.status = 404;
			return next(err);
		}
		// Successful, so render.
		res.render('yardsale_detail', { title: 'Yardsale Details', yardsale: results.yardsale });
	});
};

// Display yardsale create form on GET.
exports.yardsale_create_get = function (req, res, next) {
	res.render('yardsale_form', { title: 'Create Yardsale' });
};


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
