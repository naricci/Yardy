const Yardsale = require('../models/yardsale');
const debug = require('debug')('yardy:index.controller');

exports.index = (req, res, next) => {
	Yardsale
		.find()
		.populate('user')
		.sort([['date', 'ascending']])
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
	if (req.query.address !== null &&
			req.query.address !== '' &&
			req.query.address !== undefined &&
			req.method === 'GET') {
		debug('Searching for yard sales.');
		let params = req.query.address;
		Yardsale
			.find()
			// .where({ address: params })
			.where({ city: params })
			// .where({ state: params })
			// .where({ zipcode: params })
			.populate('user')
			.sort([['date', 'ascending']])
			.exec((err, list_yardsales) => {
				if (err) return next(err);
				if (list_yardsales === null) { // No yardsales.
					err = new Error('Yardsale not found');
					err.status = 404;
					return next(err);
				}
				Object.keys(list_yardsales).forEach((yardsale) => {
					debug(yardsale);
				});
				// Successful, so render
				res.render('index', {
					title: 'Yardy Search Results',
					yardsale_list: list_yardsales
				});
			});
	} else {
		Yardsale
			.find()
			.populate('user')
			.sort([['date', 'ascending']])
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
