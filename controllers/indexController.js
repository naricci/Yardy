const Yardsale = require('../models/yardsale');

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
	let params = req.body.searchParams;
	let query = Yardsale
		.find({ 'address': params });
	query.select('phone address address2 city state zipcode date starttime endtime description imagename user');
	query.populate('user');
	query.exec((err, list_yardsales) => {
		if (err) return next(err);
		if (list_yardsales === null) { // No yardsales.
			err = new Error('Yardsale not found');
			err.status = 404;
			return next(err);
		}
		console.log(yardsale.address);
		// Successful, so render
		res.render('index', {
			title: 'Yardy Search Results',
			yardsale_list: list_yardsales
		});
	});
};
