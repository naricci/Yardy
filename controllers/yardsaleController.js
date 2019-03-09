const Yardsale = require('../models/yardsale.js');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const async = require('async');
const debug = require('debug')('yardy:yardsale.controller');

exports.index = function(req, res) {
	async.parallel(
		{
			yardsale_count: function(callback) {
				Yardsale.count(callback);
			},
		}, function(err, results) {
			res.render('/', {
				title: 'Yardy Home',
				error: err,
				data: results
			});
		});
};

// Display list of all yardsales.
exports.yardsale_list = function(req, res, next) {
	Yardsale.find({}, 'yardsale author ')
		.populate('author')
		.exec(function(err, list_yardsales) {
			if (err) {
				return next(err);
			}
			// Successful, so render
			res.render('yardsale_list', {
				title: 'Yardsale List',
				yardsale_list: list_yardsales
			});
		});
};

// Display detail page for a specific yardsale.
exports.yardsale_detail = function(req, res, next) {
	async.parallel(
		{
			yardsale: function(callback) {
				Yardsale.findById(req.params.id)
					.populate('author')
					.populate('genre')
					.exec(callback);
			},
			yardsale_instance: function(callback) {
				BookInstance.find({ book: req.params.id }).exec(callback);
			}
		},
		function(err, results) {
			if (err) {
				return next(err);
			}
			if (results.yardsale == null) {
				// No results.
				err = new Error('Yardsale not found');
				err.status = 404;
				return next(err);
			}
			// Successful, so render.
			res.render('yardsale_detail', {
				title: 'Details',
				yardsale: results.yardsale,
				yardsale_instances: results.yardsale_instance
			});
		}
	);
};

// Display yardsale create form on GET.
exports.yardsale_create_get = function(req, res, next) {
	// Get all authors and genres, which we can use for adding to our yardsale.
	async.parallel(
		{
			authors: function(callback) {
				Author.find(callback);
			},
			genres: function(callback) {
				Genre.find(callback);
			}
		},
		function(err, results) {
			if (err) {
				return next(err);
			}
			res.render('yardsale_form', {
				title: 'Create Yardsale',
				authors: results.authors,
				genres: results.genres
			});
		}
	);
};

// Handle yardsale create on POST.
exports.yardsale_create_post = [
	// Convert the genre to an array.
	(req, res, next) => {
		if (!(req.body.genre instanceof Array)) {
			if (typeof req.body.genre === 'undefined') req.body.genre = [];
			else req.body.genre = new Array(req.body.genre);
		}
		next();
	},

	// Validate fields.
	body('title', 'Title must not be empty.')
		.isLength({ min: 1 })
		.trim(),
	body('author', 'Author must not be empty.')
		.isLength({ min: 1 })
		.trim(),
	body('summary', 'Summary must not be empty.')
		.isLength({ min: 1 })
		.trim(),
	body('isbn', 'ISBN must not be empty')
		.isLength({ min: 1 })
		.trim(),

	// Sanitize fields.
	sanitizeBody('*')
		.trim()
		.escape(),
	sanitizeBody('genre.*')
		.trim()
		.escape(),
	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		var errors = validationResult(req);

		// Create a Yardsale object with escaped and trimmed data.
		var yardsale = new Yardsale({
			title: req.body.title,
			author: req.body.author,
			summary: req.body.summary,
			isbn: req.body.isbn,
			genre: req.body.genre
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.

			// Get all authors and genres for form.
			async.parallel(
				{
					authors: function(callback) {
						Author.find(callback);
					},
					genres: function(callback) {
						Genre.find(callback);
					}
				},
				function(err, results) {
					if (err) {
						return next(err);
					}

					// Mark our selected genres as checked.
					for (let i = 0; i < results.genres.length; i++) {
						if (book.genre.indexOf(results.genres[i]._id) > -1) {
							results.genres[i].checked = 'true';
						}
					}
					res.render('yardsale_form', {
						title: 'Create Yardsale',
						authors: results.authors,
						genres: results.genres,
						book: book,
						errors: errors.array()
					});
				}
			);
			return;
		} else {
			// Data from form is valid. Save yardsale.
			yardsale.save(function(err) {
				if (err) {
					return next(err);
				}
				// Successful - redirect to new yardsale record.
				res.redirect(yardsale.url);
			});
		}
	}
];

// Display yardsale delete form on GET.
exports.yardsale_delete_get = function(req, res, next) {
	async.parallel(
		{
			yardsale: function(callback) {
				Yardsale.findById(req.params.id)
					.populate('author')
					.populate('genre')
					.exec(callback);
			},
			book_bookinstances: function(callback) {
				BookInstance.find({ yardsale: req.params.id }).exec(callback);
			}
		},
		function(err, results) {
			if (err) {
				return next(err);
			}
			if (results.yardsale == null) {
				// No results.
				// TODO originally res.redirect('/catalog/book');
				res.redirect('/yardsale');
			}
			// Successful, so render.
			res.render('yardsale_delete', {
				title: 'Delete Yardsale',
				yardsale: results.yardsale,
				book_instances: results.book_bookinstances
			});
		}
	);
};

// Handle yardsale delete on POST.
exports.yardsale_delete_post = function(req, res, next) {
	// Assume the post has valid id (ie no validation/sanitization).

	async.parallel(
		{
			yardsale: function(callback) {
				Yardsale.findById(req.params.id)
					.populate('author')
					.populate('genre')
					.exec(callback);
			},
			book_bookinstances: function(callback) {
				BookInstance.find({ yardsale: req.params.id }).exec(callback);
			}
		},
		function(err, results) {
			if (err) {
				return next(err);
			}
			// Success
			if (results.book_bookinstances.length > 0) {
				// Book has book_instances. Render in same way as for GET route.
				res.render('yardsale_delete', {
					title: 'Delete Yardsale',
					yardsale: results.yardsale,
					book_instances: results.book_bookinstances
				});
				return;
			} else {
				// Yardsale has no BookInstance objects. Delete object and redirect to the list of yardsales.
				Yardsale.findByIdAndRemove(req.body.id, function deleteYardsale(err) {
					if (err) {
						return next(err);
					}
					// Success - got to books list.
					// res.redirect('/catalog/books');
					res.redirect('/yardsale');
				});
			}
		}
	);
};

// Display yardsale update form on GET.
exports.yardsale_update_get = function(req, res, next) {
	// Get yardsale, authors and genres for form.
	async.parallel(
		{
			book: function(callback) {
				Yardsale.findById(req.params.id)
					.populate('author')
					.populate('genre')
					.exec(callback);
			},
			authors: function(callback) {
				Author.find(callback);
			},
			genres: function(callback) {
				Genre.find(callback);
			}
		},
		function(err, results) {
			if (err) {
				return next(err);
			}
			if (results.yardsale == null) {
				// No results.
				var err = new Error('Yardsale not found');
				err.status = 404;
				return next(err);
			}
			// Success.
			// Mark our selected genres as checked.
			for (
				var all_g_iter = 0;
				all_g_iter < results.genres.length;
				all_g_iter++
			) {
				for (
					var yardsale_g_iter = 0;
					yardsale_g_iter < results.yardsale.genre.length;
					yardsale_g_iter++
				) {
					if (
						results.genres[all_g_iter]._id.toString() ==
						results.yardsale.genre[yardsale_g_iter]._id.toString()
					) {
						results.genres[all_g_iter].checked = 'true';
					}
				}
			}
			res.render('yardsale_form', {
				title: 'Update Yardsale',
				authors: results.authors,
				genres: results.genres,
				yardsale: results.yardsale
			});
		}
	);
};

// Handle yardsale update on POST.
exports.yardsale_update_post = [
	// Convert the genre to an array.
	(req, res, next) => {
		if (!(req.body.genre instanceof Array)) {
			if (typeof req.body.genre === 'undefined') req.body.genre = [];
			else req.body.genre = new Array(req.body.genre);
		}
		next();
	},

	// Validate fields.
	body('title', 'Title must not be empty.')
		.isLength({ min: 1 })
		.trim(),
	body('author', 'Author must not be empty.')
		.isLength({ min: 1 })
		.trim(),
	body('summary', 'Summary must not be empty.')
		.isLength({ min: 1 })
		.trim(),
	body('isbn', 'ISBN must not be empty')
		.isLength({ min: 1 })
		.trim(),

	// Sanitize fields.
	sanitizeBody('title')
		.trim()
		.escape(),
	sanitizeBody('author')
		.trim()
		.escape(),
	sanitizeBody('summary')
		.trim()
		.escape(),
	sanitizeBody('isbn')
		.trim()
		.escape(),
	sanitizeBody('genre.*')
		.trim()
		.escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		var errors = validationResult(req);

		// Create a Yardsale object with escaped/trimmed data and old id.
		var yardsale = new Yardsale({
			title: req.body.title,
			author: req.body.author,
			summary: req.body.summary,
			isbn: req.body.isbn,
			genre: typeof req.body.genre === 'undefined' ? [] : req.body.genre,
			_id: req.params.id // This is required, or a new ID will be assigned!
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.

			// Get all authors and genres for form
			async.parallel(
				{
					authors: function(callback) {
						Author.find(callback);
					},
					genres: function(callback) {
						Genre.find(callback);
					}
				},
				function(err, results) {
					if (err) {
						return next(err);
					}

					// Mark our selected genres as checked.
					for (let i = 0; i < results.genres.length; i++) {
						if (yardsale.genre.indexOf(results.genres[i]._id) > -1) {
							results.genres[i].checked = 'true';
						}
					}
					res.render('yardsale_form', {
						title: 'Update Yardsale',
						authors: results.authors,
						genres: results.genres,
						yardsale: yardsale,
						errors: errors.array()
					});
				}
			);
			return;
		} else {
			// Data from form is valid. Update the record.
			Yardsale.findByIdAndUpdate(req.params.id, yardsale, {}, function(
				err,
				theyardsale
			) {
				if (err) {
					return next(err);
				}
				// Successful - redirect to yardsale detail page.
				res.redirect(theyardsale.url);
			});
		}
	}
];


//////////for search
module.exports.all_yardsales = function (req, res) {
	console.log('All Yardsales Unsorted');

	Yardsale.find()
		.exec()
		.then (index => {
			res.send(index);
		}).catch(err => {
			res.status(500).send({
				message: err.message
			});
		});
};

module.exports.all_yardsales_sorted = function (req, res) {
	console.log('All Yardsales Sorted');

	Yardsale.find()
		.sort([['date', 'ascending']])
		.exec()
		.then (index => {
			res.send(index);
		}).catch(err => {
			res.status(500).send({
				message: err.message
			});
		});
};
