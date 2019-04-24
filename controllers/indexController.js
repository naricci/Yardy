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

// TODO - Displaying results not working
exports.search = (req, res, next) => {
	debug('Searching for yard sales.');
	var params = req.body.searchParams;
	let paramsLike = '/'+params+'/i';
	req.query.address = params;
	Yardsale
		.find()
		.where({ 'city': paramsLike })
		// .populate('user')
		// .sort([['date', 'ascending']])
		.exec((err, list_yardsales) => {
			if (err) return next(err);
			if (list_yardsales === null) { // No yardsales.
				err = new Error('Yardsale not found');
				err.status = 404;
				return next(err);
			}
			debug(list_yardsales);
			// Successful, so render
			res.render('index', {
				title: 'Yardy Search Results',
				yardsale_list: list_yardsales
			});
		});
};
