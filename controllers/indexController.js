const debug = require('debug')('yardy:index.controller');
const Yardsale = require('../models/yardsale');
const helpers = require('../util/helpers');

exports.index = (req, res, next) => {
	Yardsale
		.find()
		.populate('user')
		.sort([['date', 'ascending']])
		.exec()
		.catch((err, list_yardsales) => {
			if (err) return next(err);
			if (list_yardsales === null) { // No yardsales.
				err = new Error('Yardsale not found');
				err.status = 404;
				return next(err);
			}
			helpers.sendJSONresponse(res, 404, { title: 'An error occurred', err });
		})
		.then(list_yardsales => {
			// Successful, so render
			// res.render('index', { title: 'Yardy', yardsale_list: list_yardsales });
			helpers.sendJSONresponse(res, 200, { title: 'Yardy', list_yardsales });
		});
};

exports.search = (req, res, next) => {
	let params = req.query.search;
	let paramsLike = /^req.query.search/i;
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
			sortType = ['date', 'ascending'];
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
					res.render('index', { title: 'Yardy Search Results', results: results });
				}
				else {
					Object.keys(list_yardsales).forEach(yardsale => debug(yardsale));
					// Successful, so render
					res.render('index', { title: 'Yardy Search Results', yardsale_list: list_yardsales });
					// helpers.sendJSONresponse(res, 200, { title: 'Yardy Search Results', list_yardsales });
				}
			});
	} else {
		Yardsale
			.find()
			.populate('user')
			// .sort([['date', 'ascending']])
			.sort([sortType])
			.exec()
			.catch((err, list_yardsales) => {
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
					res.render('index', { title: 'Yardy Search Results', results: results });
				}
			})
			.then(list_yardsales => {
				// Successful, so render
				res.render('index', { title: 'Yardy', yardsale_list: list_yardsales });
			});
	}
};
