const express = require('express');
const router = express.Router();
const Yardsale = require('../models/yardsale');

/* GET home page. */
router.get('/', function(req, res) {
	Yardsale
		.find()
		.sort([['date', 'ascending']])
		.exec(function(err, list_yardsales) {
			if (err) {
				return next(err);
			}
			// Successful, so render
			res.render('index', {
				title: 'Yardy',
				yardsale_list: list_yardsales
			});
		});
	// res.render('index', { title: 'Yardy' });
});

module.exports = router;
