const async = require('async');
const debug = require('debug')('yardy:favorite.controller');
// Models
const Favorite = require('../models/favorite');

// TODO Finish writing function to GET favorites
// Display favorites page on GET
exports.favorites_get = (req, res, next) => {
	Favorite
		.find({})
		.where('user').equals(req.user._id)
		.populate('yardsale')
		// .select('phone address address2 city state zipcode date starttime endtime user description imagename')
		.exec()
		.catch((err, all_favorites) => {
			if (err) return next(err);
			if (all_favorites === null) {
				let err = new Error('Favorites not found');
				err.status = 404;
				return next(err);
			}
		})
		.then(all_favorites => {
			// Successful, so render
			res.render('user_favorites', {
				title: 'Manage Favorites',
				favorites_list: all_favorites
			});
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
	// POST favorite object and redirect to the home page.
	favorite.save((err) => {
		if (err) return next(err);
		// Success - go to yardsale list.
		res.redirect('/users/'+req.user._id+'/favorites');
	});
};

// TODO Finish writing function to DELETE favorites
// Handle favorites page on DELETE
exports.favorites_delete = (req, res, next) => {
	// Favorite
	// 	.findByIdAndDelete(req.body.favorite, function deleteFavorite(err) {
	// 		if (err) return next(err);
	// 		// Success - go to yardsale list.
	// 		res.redirect('/users/'+req.user._id+'/favorites');
	// 	});

	async.parallel({
		favorite: (callback) =>{
			Favorite
				.findById(req.body.favorite)
				.exec(callback);
		},
	}, (err) => {
		if (err) return next(err);
		// Success.
		else {
			// Delete favorite object and redirect to the list of yardsales.
			Favorite
				.findByIdAndDelete(req.body.favorite, function deleteFavorite(err) {
					if (err) return next(err);
					// Success - go to yardsale list.
					res.redirect('/users/'+req.user._id+'/favorites');
				});
		}
	});
};
