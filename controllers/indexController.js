const Yardsale = require('../models/yardsale');
const debug = require('debug')('yardy:index.controller');

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
	let paramsLike = '/'+req.query.search+'/';
	let sort = req.query.sort;
	let sortType = [];
	if (sort === 'date')
		sortType = ['date', 'ascending'];
	else if (sort === 'city')
		sortType = ['city', 'ascending'];
	else if (sort === 'state')
		sortType = ['state', 'ascending'];
	else if (sort === 'zipcode')
		sortType = ['zipcode', 'ascending'];
	else
		sortType = [];

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
