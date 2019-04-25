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

// exports.search = (req, res, next) => {
// 	if (req.query.address !== null &&
// 			req.query.address !== '' &&
// 			req.query.address !== undefined &&
// 			req.method === 'GET') {
// 		debug('Searching for yard sales.');
// 		let params = req.query.address;
// 		Yardsale
// 			.find()
// 			// .where({ address: params })
// 			.where({ city: params })
// 			// .where({ state: params })
// 			// .where({ zipcode: params })
// 			.populate('user')
// 			.sort([['date', 'ascending']])
// 			.exec((err, list_yardsales) => {
// 				if (err) return next(err);
// 				if (list_yardsales === null) { // No yardsales.
// 					err = new Error('Yardsale not found');
// 					err.status = 404;
// 					return next(err);
// 				}
// 				Object.keys(list_yardsales).forEach((yardsale) => {
// 					debug(yardsale);
// 				});
// 				// Successful, so render
// 				res.render('index', {
// 					title: 'Yardy Search Results',
// 					yardsale_list: list_yardsales
// 				});
// 			});
// 	} else {
// 		Yardsale
// 			.find()
// 			.populate('user')
// 			.sort([['date', 'ascending']])
// 			.exec()
// 			.catch((err) => {
// 				if (err) return next(err);
// 			})
// 			.then((list_yardsales) => {
// 			// Successful, so render
// 				res.render('index', {
// 					title: 'Yardy',
// 					yardsale_list: list_yardsales
// 				});
// 			});
// 	}
// };


exports.search = (req, res, next) => {
	
	let params = req.query.address;
	let sort = req.body.sort;

 	if (req.query.address !== null &&
		req.query.address !== '' &&
		req.query.address !== undefined &&
		req.method === 'GET') {
		debug('Searching for yard sales.');

		if(sort === 'date') {
			Yardsale
				.find({$or: [{city: params}, {state: params}, {zipcode: params}]})
				//.where()
				.populate('user')
				.sort([['date', 'ascending']])
				.exec((err, list_yardsales) => {
					if (err) return next(err);
					if (list_yardsales === null) { // No yardsales.
						err = new Error('Yardsale not found');
						err.status = 404;
						return next(err);
					}
					Object.keys(list_yardsales).forEach((item) => {
						debug(item);
					});
					// Successful, so render
					res.render('index', {
						title: 'Yardy Search Results(dt1)',
						yardsale_list: list_yardsales
					});
				});
		} else if(sort === 'starttime') {
			Yardsale
				.find({$or: [{city: params}, {state: params}, {zipcode: params}]})
				.populate('user')
				.sort([['timestamp', 'ascending']])
				.exec((err, list_yardsales) => {
					if (err) return next(err);
					if (list_yardsales === null) { // No yardsales.
						err = new Error('Yardsale not found');
						err.status = 404;
						return next(err);
					}
					Object.keys(list_yardsales).forEach((item) => {
						debug(item);
					});
					// Successful, so render
					res.render('index', {
						title: 'Yardy Search Results(strttm1)',
						yardsale_list: list_yardsales
					});
				});
		} else if(sort === 'distance') {
			//
			//
			//
		} else {
			Yardsale
				.find({$or: [{city: params}, {state: params}, {zipcode: params}]})
				.populate('user')
				.sort([['city', 'ascending']])
				.exec((err, list_yardsales) => {
					if (err) return next(err);
					if (list_yardsales === null) { // No yardsales.
						err = new Error('Yardsale not found');
						err.status = 404;
						return next(err);
					}
					Object.keys(list_yardsales).forEach((item) => {
						debug(item);
					});
					// Successful, so render
					res.render('index', {
						title: 'Yardy Search Results(deflt1)',
						yardsale_list: list_yardsales
					});
				});
		}
	} else {
		if(sort === 'date') {
			Yardsale
				.find()
				.populate('user')
				.sort([['date', 'ascending']])
				.exec((err, list_yardsales) => {
					if (err) return next(err);
					if (list_yardsales === null) { // No yardsales.
						err = new Error('Yardsale not found');
						err.status = 404;
						return next(err);
					}
					Object.keys(list_yardsales).forEach((item) => {
						debug(item);
					});
					// Successful, so render
					res.render('index', {
						title: 'Yardy Search Results(dt2)',
						yardsale_list: list_yardsales
					});
				});
		} else if(sort === 'starttime') {
			Yardsale
				.find()
				.populate('user')
				.sort([['timestamp', 'ascending']])
				.exec((err, list_yardsales) => {
					if (err) return next(err);
					if (list_yardsales === null) { // No yardsales.
						err = new Error('Yardsale not found');
						err.status = 404;
						return next(err);
					}
					Object.keys(list_yardsales).forEach((item) => {
						debug(item);
					});
					// Successful, so render
					res.render('index', {
						title: 'Yardy Search Results(strttm2)',
						yardsale_list: list_yardsales
					});
				});
		} else if(sort === 'distance') {
			//
			//
			//
		} else {
			Yardsale
				.find()
				.populate('user')
				.sort([['city', 'ascending']])
				.exec((err, list_yardsales) => {
					if (err) return next(err);
					if (list_yardsales === null) { // No yardsales.
						err = new Error('Yardsale not found');
						err.status = 404;
						return next(err);
					}
					Object.keys(list_yardsales).forEach((item) => {
						debug(item);
					});
					// Successful, so render
					res.render('index', {
						title: 'Yardy Search Results(deflt2)',
						yardsale_list: list_yardsales
					});
				});
		}
	}
};
