// const async = require('async');
// const debug = require('debug')('yardy:yardsale.controller');
// const { validationResult } = require('express-validator/check');
// const S3 = require('../config/s3_config');
// // Models
// const User = require('../models/user');
// const Yardsale = require('../models/yardsale');

import async from 'async';
import debugLib from 'debug';
import { validationResult } from 'express-validator/check';
import S3 from '../config/s3_config';
import User from '../models/user';
import Yardsale from '../models/yardsale';

const debug = debugLib('yardy:yardsale.controller');
const yardsaleController = {};

// Display list of all yardsales.
yardsaleController.yardsale_list = async (req, res, next) => {
	const params = req.body.address;
	if (params === undefined || params === null || params === '') {
	  Yardsale
			.find()
			.populate('user')
			.sort([['date', 'ascending']])
			.exec((err, list_yardsales) => {
				if (err) {
					return next(err);
				}
				// Successful, so render
				res.render('yardsale_list', {
					title: 'Yard Sale Search Results',
					yardsale_list: list_yardsales
				});
			});
	}
};

// Display detail page for a specific yardsale.
yardsaleController.yardsale_detail = async (req, res, next) => {
	async.parallel({
		yardsale: (callback) => {
			Yardsale
				.findById(req.params.id)
				.populate('user')
				.exec(callback);
		},
		user: (callback) => {
			User
				.findById(req.user._id)
				.exec(callback);
		},
	}, (err, results) => {
		if (err) return next(err); // Error in API usage.
		if (results.yardsale === null) { // No yardsales.
			err = new Error('Yardsale not found');
			err.status = 404;
			return next(err);
		}
		if (results.user === null) { // No users.
			err = new Error('User not found');
			err.status = 404;
			return next(err);
		}

		// Successful, so render.
		res.render('yardsale_detail', {
			title: 'Yardsale Details',
			yardsale: results.yardsale,
			user: results.user
		});
	});
};

// Display yardsale create form on GET.
yardsaleController.yardsale_create_get = async (req, res, next) => {
	User
		.findById(req.params.id)
		.exec()
		.catch((err, results) => {
			if (err) return next(err);
			if (results === null) { // No results.
				let err = new Error('User not found.');
				err.status = 404;
				return next(err);
			}
		})
		.then(() => {
			res.render('yardsale_form', {
				title: 'Create Yardsale'
			});
		});
};

// Handle Yardsale create on POST.
yardsaleController.yardsale_create_post = async (req, res, next) => {
	// Extract the validation errors from a request.
	let errors = validationResult(req);
	let errorsArray = errors.array();

	if (errorsArray.length > 0) {
		// There are errors. Render form again with sanitized values/errors messages.
		res.render('yardsale_form', { title: 'Create Yardsale', yardsale: req.body, errors: errorsArray });
		// return;
	}
	else {

		if (req.file === undefined) {
			// Create an Yardsale object with escaped and trimmed data.
			let yardsale = new Yardsale({
				phone: req.body.phone,
				address: req.body.address,
				address2: req.body.address2,
				city: req.body.city,
				state: req.body.state,
				zipcode: req.body.zipcode,
				full_address: req.body.address + req.body.city + req.body.state + req.body.zipcode,
				date: req.body.date,
				starttime: req.body.starttime,
				endtime: req.body.endtime,
				description: req.body.description,
				user: req.user._id,
			});

			yardsale.save((err) => {
				if (err) return next(err);

				// Successful - redirect to new yardsale record.
				debug(yardsale);
				res.redirect('/yardsales/'+yardsale._id);
			});
		}
		else {
			// Data from form is valid.
			const ysFile = req.file;
			let key = (req.user.username + '/' + ysFile.originalname);
			S3.params.Body = ysFile.buffer;
			S3.params.ContentType = ysFile.mimetype;
			S3.params.Key = key;


			// Create an Yardsale object with escaped and trimmed data.
			let yardsale = new Yardsale({
				phone: req.body.phone,
				address: req.body.address,
				address2: req.body.address2,
				city: req.body.city,
				state: req.body.state,
				zipcode: req.body.zipcode,
				full_address: req.body.address + req.body.city + req.body.state + req.body.zipcode,
				date: req.body.date,
				starttime: req.body.starttime,
				endtime: req.body.endtime,
				description: req.body.description,
				user: req.user._id,
				imagename: ysFile.originalname
			});

			yardsale.save((err) => {
				if (err) return next(err);

				// S3 Image upload
				S3.s3Client.putObject(S3.params, (err, data) => {
					if (err) debug('Error: ', err);
					else {
						debug(`Posting ${S3.params.Key} to ${process.env.S3_BUCKET} in S3`);
						debug(data);
					}
				});

				// Successful - redirect to new yardsale record.
				debug(yardsale);
				res.redirect('/yardsales/'+yardsale._id);
			});
		}
	}
};

// Display Yardsale delete form on GET.
yardsaleController.yardsale_delete_get = async (req, res, next) => {
	async.parallel({
		yardsale: (callback) => {
			Yardsale
				.findById(req.params.id)
				.populate('user')
				.exec(callback);
		},
		user: (callback) => {
			User
				.find({ 'user': req.params.id }, 'username email firstName lastName phone profilepic')
				.exec(callback);
		},
	}, (err, results) => {
		if (err) return next(err);
		if (results === null) { // No results.
			res.redirect('/yardsales');
		}

		// Successful, so render.
		res.render('yardsale_delete', {
			title: 'Delete Yardsale',
			yardsale: results.yardsale,
			user: results.user
		});
	});
};

// Handle Yardsale delete on POST.
yardsaleController.yardsale_delete_post = async (req, res, next) => {
	async.parallel({
		yardsale: (callback) => {
			Yardsale
				.findById(req.body.id)
				.exec(callback);
		},
	}, (err, results) => {
		if (err) return next(err);
		// Success.
		if (results.yardsale.length === 1) {
			// yardsale has books. Render in same way as for GET route.
			res.render('yardsale_delete', { title: 'Delete Yardsale', yardsale: results.yardsale });
			return;
		}
		else {
			// Delete yardsale object and redirect to the list of yardsales.
			Yardsale
				.findByIdAndDelete(req.body.id, function deleteYardsale(err) {
					if (err) return next(err);
					// Success - go to yardsale list.
					res.redirect('/users/'+results.yardsale.user._id);
				});
		}
	});
};

// Display Yardsale update form on GET.
yardsaleController.yardsale_update_get = async (req, res, next) => {
	debug('Getting YS update page.');
	Yardsale
		.findById(req.params.id)
		.populate('user')
		.exec()
		.catch((err, yardsale) => {
			if (err) return next(err);
			if (yardsale === null) { // No results.
				let err = new Error('Yardsale not found.');
				err.status = 404;
				return next(err);
			}
		})
		.then((yardsale) => {
			// Success.
			res.render('yardsale_edit', {
				title: 'Update Yardsale',
				yardsale: yardsale
			});
		});
};

// Handle Yardsale update on POST.
yardsaleController.yardsale_update_post = async (req, res, next) => {

	// If there is no image included in post
	if (req.file === undefined) {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		const errorArray = errors.array();

		// Create Yardsale object with escaped and trimmed data (and the old id!)
		let yardsale = new Yardsale({
			phone: req.body.phone,
			address: req.body.address,
			address2: req.body.address2,
			city: req.body.city,
			state: req.body.state,
			zipcode: req.body.zipcode,
			date: req.body.date,
			starttime: req.body.starttime,
			endtime: req.body.endtime,
			description: req.body.description,
			_id: req.params.id
		});

		if (errorArray.length > 0) {
			// There are errors. Render the form again with sanitized values and error messages.
			res.render('yardsale_edit', {
				title: 'Update Yardsale',
				yardsale: yardsale,
				errors: errorArray
			});
		}
		else {
			// Data from form is valid. Update the yardsale record.
			Yardsale
				.findByIdAndUpdate(req.params.id, yardsale, {}, (err, theyardsale) => {
					if (err) return next(err);

					// Successful - redirect to yardsale detail page.
					res.redirect('/yardsales/'+theyardsale._id);
				});
		}
	}

	// there is an image included, now upload it to S3
	else {

		// Extract the validation errors from a request.
		const errors = validationResult(req);
		const errorArray = errors.array();

		let ysFile = req.file;
		let key = (req.user.username + '/' + ysFile.originalname);
		const oldKey = (req.user.username + '/' + req.yardsale.imagename);
		S3.params.Body = ysFile.buffer;
		S3.params.ContentType = ysFile.mimetype;
		S3.params.Key = key;

		// Create Yardsale object with escaped and trimmed data (and the old id!)
		let yardsale = new Yardsale({
			phone: req.body.phone,
			address: req.body.address,
			address2: req.body.address2,
			city: req.body.city,
			state: req.body.state,
			zipcode: req.body.zipcode,
			date: req.body.date,
			starttime: req.body.starttime,
			endtime: req.body.endtime,
			description: req.body.description,
			imagename: ysFile.originalname,
			_id: req.params.id
		});

		if (errorArray.length > 0) {
			// There are errors. Render the form again with sanitized values and error messages.
			res.render('yardsale_edit', {
				title: 'Update Yardsale',
				yardsale: yardsale,
				errors: errorArray
			});
		}
		else {
			// Data from form is valid. Update the yardsale record.
			Yardsale
				.findByIdAndUpdate(req.params.id, yardsale, {}, (err, theyardsale) => {
					if (err) return next(err);

					// TODO - Fix ability to delete old images before posting the new ones.
					S3.deleteParams.Key = oldKey;
					// Delete old profile picture from S3 bucket first
					S3.s3Client.deleteObject(S3.deleteParams, (err, data) => {
						if (err) debug(err, err.stack);
						else {
							debug(`Deleting ${S3.deleteParams.Key} in ${process.env.S3_BUCKET} in S3`);
							debug(data);
						}
					});

					// Upload yard sale image to S3 bucket
					S3.s3Client.putObject(S3.params, (err, data) => {
						if (err) debug(err, err.stack);
						else {
							debug(`Posting ${S3.params.Key} to ${process.env.S3_BUCKET} in S3`);
							debug(data);
						}
					});

					// Successful - redirect to yardsale detail page.
					res.redirect('/yardsales/' + theyardsale._id);
				});
		}
	}
};

export default yardsaleController;
