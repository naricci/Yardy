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

/* Old way */
// exports.index = (req, res, next) => {
// 	Yardsale
// 		.find()
// 		.populate('user')
// 		.sort([['date', 'ascending']])
// 		.exec((err, list_yardsales) => {
// 			if (err) return next(err);
// 			// Successful, so render
// 			res.render('index', {
// 				title: 'Yardy',
// 				yardsale_list: list_yardsales
// 			});
// 		});
// };
