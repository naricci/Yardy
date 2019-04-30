const async = require('async');
const debug = require('debug')('yardy:index.controller');
const Favorite = require('../models/favorite');
const User = require('../models/user');
const Yardsale = require('../models/yardsale');

exports.index = (req, res, next) => {
	Yardsale
		.find()
		.populate('user')
		// .sort([['date', 'ascending']])
		.exec()
		.catch((err) => {
			if (err) return next(err);
		})
		.then((list_yardsales) => {
			// Successful, so render
			res.render('index', {
				title: 'Yardy',
				yardsale_list: list_yardsales
			});
		});
};

exports.search = (req, res, next) => {
	let params = req.query.search;
	// let paramsLike = '/'+req.query.search+'/';
	let sort = req.query.sort;
	let sortType = [];
	switch (sort) {
		case 'date':
			sortType = ['date', 'ascending'];
			break;
		case 'city':
			sortType = ['city', 'ascending'];
			break;
		case 'state':
			sortType = ['state', 'ascending'];
			break;
		case 'zipcode':
			sortType = ['zipcode', 'ascending'];
			break;
		default:
			sortType = [];
			break;
	}

	if (params !== null && params !== '' &&
			params !== undefined && req.method === 'GET') {
		debug('Searching for yard sales.');

		Yardsale
			.find({ $or: [{address: params}, {city: params}, {state: params}, {zipcode: params}] })
			// TODO - Finish full-text search for full_address
			// Full-Text Search
			// .find({ $text: { $search: params } })
			.populate('user')
			.sort([sortType])
			.exec((err, list_yardsales) => {
				if (err) return next(err);
				if (list_yardsales === null) { // No yardsales.
					err = new Error('Yardsale not found');
					err.status = 404;
					return next(err);
				}
				else if (list_yardsales.length === 0) {
					debug('No yard sales found.');
					const results = 'No yard sales found.';
					// Successful, so render
					res.render('index', {
						title: 'Yardy Search Results',
						results: results
					});
				}
				else {
					Object.keys(list_yardsales).forEach((yardsale) => {
						debug(yardsale);
					});
					// Successful, so render
					res.render('index', {
						title: 'Yardy Search Results',
						yardsale_list: list_yardsales
					});
				}
			});
	} else {
		Yardsale
			.find()
			.populate('user')
			// .sort([['date', 'ascending']])
			.sort([sortType])
			.exec()
			.catch((err) => {
				if (err) return next(err);
			})
			.then((list_yardsales) => {
			// Successful, so render
				res.render('index', {
					title: 'Yardy',
					yardsale_list: list_yardsales
				});
			});
	}
};

// TODO Finish writing function to POST favorites
// Handle favorites page on POST
exports.favorites_post = (req, res, next) => {
	let favorite = new Favorite({
		user: req.user._id,
		yardsale: req.yardsale._id,
		isChecked: true
	});
	// POST favorite object and redirect to the home page.
	favorite.save((err) => {
		if (err) {
			debug(favorite);
			return next(err);
		}
		// Success - go to yardsale list.
		res.redirect('/');
	});
};

// TODO Finish writing function to POST favorites
// Handle favorites page on DELETE
exports.favorites_delete = (req, res, next) => {

};
