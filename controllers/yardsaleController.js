var Yardsale = require('../models/yardsale.js');
var debug = require('debug')('yardy:yardsale');

module.exports.post_yardsale = function (req, res) {

	if (req.method === 'POST') {

		let msg = '';

		Yardsale.create({
			firstname: req.body.firstname,
			lastname : req.body.lastname,
			username : req.body.username,
			phone : req.body.phone,
			address : req.body.address,
			city : req.body.city,
		  state : req.body.state,
		  zipcode : req.body.zipcode,
			description : req.body.description,
			date : req.body.date,
			starttime : req.body.starttime,
			endtime : req.body.endtime,
			imgname : req.body.imgname
		})
			.then(function () {
				msg = 'yardsale was Saved';
				return;
			})
			.catch(function (err) {
				msg = 'yardsale was not Saved';
				return err.message;
			}).then(function (err) {
				res.render('index', {
					title: 'Add yardsale',
					message: msg,
					error: err
				});
			});

	} else {
		res.render('index', {
			title: 'Add yardsale',
			message: ''
		});
	}
};

module.exports.view = function (req, res) {
	Yardsale
		.find()
		.exec()
		.then(function (results) {
			res.render('view', {
				title: 'View yardsale',
				results: results
			});
		});
};


module.exports.update = function (req, res) {

	var id = req.params.id;
	var msg = '';

	if (req.method === 'POST') {

		id = req.body._id;

		Yardsale
			.findById(id)
			.exec()
			.then(function (yardsaleData) {
				// figure out why the data is not saving.
				yardsaleData.firstname = req.body.firstname;
				yardsaleData.lastname = req.body.lastname;
				yardsaleData.username = req.body.username;
				yardsaleData.phone = req.body.phone;
				yardsaleData.city = req.body.city;
				yardsaleData.state = req.body.state;
				yardsaleData.zipcode = req.body.zipcode;
				yardsaleData.description = req.body.description;
				yardsaleData.date = req.body.date;
				yardsaleData.starttime = req.body.starttime;
				yardsaleData.endtime = req.body.endtime;
				yardsaleData.imgname = req.body.imgname;
				debug(req.body);
				return yardsaleData.save();
			})
			.then(function () {
				msg = 'data has been updated';
				return;
			})
			.catch(function () {
				msg = 'data has NOT been updated';
				return;
			})
			.then(() => {
				finish();
			});
	} else {
		finish();
	}

	function finish() {
		Yardsale
			.findOne({ '_id': id })
			.exec()
			.then(function (results) {
				res.render('update', {
					title: 'Update yardsales',
					message: msg,
					results: results
				});

			})
			.catch(function () {
				res.render('notfound', {
					message: 'Sorry ID not found'
				});
			});
	}
};

module.exports.delete = function (req, res) {

	var id = req.params.id,
		removed = '';

	Yardsale.remove({ _id: id })
		.then(function () {
			removed = `${id} has been removed`;
			return;
		})
		.catch(function (err) {
			removed = `${id} has not been removed`;
			return err;
		})
		.then((err) => {
			res.render('delete', {
				removed: removed
			});
		});
};
