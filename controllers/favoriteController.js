const debug = require('debug')('yardy:favorite_controller');
const Favorite = require('../models/favorite');
const assert = require('assert');

// Display favorites page on GET
exports.favorites_get = (req, res, next) => {
	debug('Getting Favorites page');

	Favorite.find({ user: req.user })
		.populate({
			path: 'yardsale',
			model: 'yardsales',
			populate: {
				path: 'user',
				model: 'users'
			}
		})
		.exec((err, favorites) => {
			if (err) return next(err);
			if (favorites.yardsale === null) {
				let err = new Error('Favorite yard sales not found');
				err.status = 404;
				return next(err);
			}
			else if (favorites.length === 0) {
				res.render('user_favorites', { title: '0 Favorites found.' });
			}
			else {
				debug(favorites);
				res.render('user_favorites', {
					title: 'Manage Favorites',
					favorites_list: favorites
				});
			}
		});
};

// Handle favorites page on POST
exports.favorites_post = (req, res, next) => {
	debug(`User ID: ${req.body.userId} \nYard Sale ID: ${req.body.yardsale}`);

	let favorite = new Favorite({
		user: req.body.userId,
		yardsale: req.body.yardsale,
		isChecked: true
	});

	// POST favorite object and redirect to the home page.
	favorite.save(err => {
		if (err) return next(err);
		// Success - go to yardsale list.
		res.redirect('/favorites/' + req.user._id);
	});
};

// Handle favorites page on POST with Promises
exports.favorites_post_Promise = (req, res, next) => {
	debug(`User ID: ${req.body.userId} \nYard Sale ID: ${req.body.yardsale}`);

	let favorite = new Favorite({
		user: req.body.userId,
		yardsale: req.body.yardsale,
		isChecked: true
	});

	try {
		var promise = favorite.save();
		assert.ok(promise instanceof Promise);

		promise.then(function (favorite) {
			assert.equal(favorite);
		});
	}
	catch (err) {
		debug(err);
	}

	res.redirect('/favorites/' + req.user._id);
};

// TODO Finish writing function to DELETE favorites
// Handle favorites page on DELETE
exports.favorites_delete = (req, res, next) => {
	debug('Deleting Favorite.');

	var id = req.params.favId;

	Favorite
		.findByIdAndDelete({ _id: id })
		.exec()
		.catch(err => {
			if (err) return next(err);
		})
		.then(favorite => {
			debug(`Favorite ${favorite._id} has been removed`);
			res.render('favorites_delete');
		});
};
