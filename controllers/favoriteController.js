const debug = require('debug')('yardy:favorite_controller');
const Favorite = require('../models/favorite');

// Display favorites page on GET
exports.favorites_get = (req, res, next) => {
	debug('Getting Favorites page');
	Favorite.find({ user: req.user._id })
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
				res.render('user_favorites', {
					title: '0 Favorites found.'
				})
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
	debug(`User ID: ${req.body.userId}`);
	debug(`Yard Sale ID: ${req.body.yardsale}`);
	let favorite = new Favorite({
		user: req.body.userId,
		yardsale: req.body.yardsale,
		isChecked: true
	});

	// TODO - Add logic to see if yard sale has already been favorited
	// POST favorite object and redirect to the home page.
	favorite.save((err) => {
		if (err) return next(err);
		// Success - go to yardsale list.
		res.redirect('/favorites/'+req.user._id);
	});
};

// TODO Finish writing function to DELETE favorites
// Handle favorites page on DELETE
exports.favorites_delete = (req, res, next) => {
	// Favorite
	// 	.remove({ _id: req.params.id }, (err) => {
	// 		if (err) return next(err);
	// 		// Success - go to yardsale list.
	// 		res.redirect('/users/'+req.user._id+'/favorites');
	// 	});

	let id = req.body.favId;
	let removed = '';
	Favorite.findByIdAndDelete({ _id: id })
		.exec()
		.then(() => {
			debug(`Favorite ${id} has been removed`);
			removed `Favorite ${id} has been removed`;
		})
		.catch((err) => {
			debug(`Favorite ${id} has not been removed`);
			removed `Favorite ${id} has not been removed`;
			return err;
		})
		.then(() => {
			// res.redirect('/users/'+req.user._id+'/favorites');
			res.redirect('favorites_delete');
		});

	// async.parallel({
	// 	favorite: (callback) =>{
	// 		Favorite
	// 			.findById(req.body.favorite)
	// 			.exec(callback);
	// 	},
	// }, (err) => {
	// 	if (err) return next(err);
	// 	// Success.
	// 	else {
	// 		// Delete favorite object and redirect to the list of yardsales.
	// 		Favorite
	// 			.findByIdAndDelete(req.body.favorite, function deleteFavorite(err) {
	// 				if (err) return next(err);
	// 				// Success - go to yardsale list.
	// 				res.redirect('/users/'+req.user._id+'/favorites');
	// 			});
	// 	}
	// });
};
