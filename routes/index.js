var express = require('express');
var router = express.Router();
// var mongoose = require('mongoose');
// var crypto = require('crypto'), hmac, signature;
// var { check, validationResult } = require('express-validator/check');
// var { matchedData, sanitize }   = require('express-validator/filter');
const yardsaleController = require('../controllers/yardsaleController');

// Models
// var User = require('../models/user');
// var Yardsale = require('../models/yardsale');

// GET home page.
// router.get('/', function(req, res) {
// 	res.redirect('/yardsales');
// });

/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('index', { title: 'Welcome!' });
});

/* GET index page */
// router.get('/', (req,res, next) => {
// 	if (!req.session.user) {
// 		return res.status(401).send();
// 	}
//
// 	return res.status(200).send('Welcome to the super-secret API');
// });

// /* GET signup page. */
// router.get('/signup', (req, res, next) => {
// 	res.render('signup', { title: 'Sign Up!' });
// });
//
// /* GET favorites page. */
// router.get('/favorites', (req, res, next) => {
// 	res.render('favorites', { title: 'Favorites' });
// });
//
// /* GET post_yardsale page */
// router.get('/post_yardsale', (req, res, next) => {
// 	res.render('post_yardsale', { title: 'Post a Yard Sale' });
// });

// TODO Finish this route
/* GET user account page. */
// router.get('/account/:id', (req, res, next) => {
// 	User.findById({ _id: id, password: password}, function (err, user) {
// 		if (err) {
// 			console.log(err);
// 			return res.status(500).send();
// 		}
//
// 		if (!user) {
// 			return res.status(404).send();
// 		}
// 		res.render('account', {title: 'User Account'});
// 	})
// });

/* GET login page. */
// router.get('/login', (req, res, next) => {
// 	res.render('login', { title: 'Log In!' });
// });


/* POST user registration page. */
// router.post('/signup',[
//
// 	check('username','Username must be at least 8 chars long')
// 		.isLength({ min: 1 }),
//
// 	check('email')
// 		.isEmail().withMessage('Please enter a valid email address')
// 		.trim()
// 		.normalizeEmail()
// 		.custom(value => {
// 			return findUserByEmail(value).then(User => {
// 				//if user email already exists throw an error
// 			})
// 		}),
// 	check('password')
// 		.isLength({ min: 1 }).withMessage('Password must be at least 8 chars long')
// 		.matches(/\d/).withMessage('Password must contain one number')
// 		.custom((value,{req, loc, path}) => {
// 			if (value !== req.body.cpassword) {
// 				// throw error if passwords do not match
// 				throw new Error("Passwords don't match");
// 			} else {
// 				return value;
// 			}
// 		}),
// ], function(req, res, next) {
// 	const errors = validationResult(req);
// 	if (!errors.isEmpty()) {
//
// 		res.json({status : "error", message : errors.array()});
// 	} else {
// 		hmac = crypto.createHmac("sha1", 'auth secret');
// 		var encpassword = '';
// 		if(req.body.password) {
// 			hmac.update(req.body.password);
// 			encpassword = hmac.digest("hex");
// 		}
// 		var document = {
// 			username:   req.body.username,
// 			email:       req.body.email,
// 			password:    encpassword,
// 		};
//
// 		var user = new User(document);
// 		user.save(function(error) {
// 			console.log(user);
// 			if(error) {
// 				throw error;
// 			}
// 			res.json({message: "Data saved successfully.", status: "success"});
// 		});
// 	}
// });


/* POST login page */
// router.post('/login', [
// 	// is username filled in?
// 	check('username','Username must be at least 1 chars long')
// 		.isLength({ min: 1 }),
// 	// is password at least 1 char long?
// 	check('password')
// 		.isLength({ min: 5 })
// ],(req, res) => {
// 	var username = req.body.username;
// 	var password = req.body.password;
//
// 	// Finds the validation errors in this request and wrap them in
// 	// in an object with handy functions
// 	const errors = validationResult(req);
// 	if (!errors.isEmpty()) {
// 		return res.status(422).json({ errors: errors.array() });
// 	}
//
// 	User.findOne({ username: username, password: password}, function (err, user) {
// 		if (err) {
// 			console.log(err);
// 			return res.status(500).send();
// 		}
//
// 		if (!user) {
// 			return res.status(404).send();
// 		}
//
// 		req.session.user = user;
// 		console.log(`${username} has logged in successfully`);
// 		return res.status(200).send();
// 	});
// });
//
//
// /* POST signup page */
// router.post('/signup', [
// 	// is email filled in?
// 	check('email', 'Please enter a valid email address').isEmail(),
// 	// do password fields match?
// 	check('password')
// 		.isLength({ min: 1 }).withMessage('Password must be at least 1 chars long')
// 	// .matches(/\d/).withMessage('Password must contain one number')
// 		.custom((value,{req, loc, path}) => {
// 			if (value !== req.body.cpassword) {
// 				// throw error if passwords do not match
// 				throw new Error('Passwords don\'t match');
// 			} else {
// 				return value;
// 			}
// 		}),
// 	// is password at least 1 char long?
// 	check('password', 'Password must be at least 1 chars long').isLength({ min: 1 })
// ], (req, res) => {
// 	var email = req.body.email;
// 	var username = req.body.username;
// 	var password = req.body.password;
//
// 	var newUser = new User();
// 	newUser.email = email;
// 	newUser.username = username;
// 	newUser.password = password;
// 	newUser.save(function (err, savedUser) {
// 		if (err) {
// 			console.log(err);
// 			return res.status(500).send();
// 		}
// 		// var msg = document.getElementsByClassName("msgDiv");
// 		// msg.html = "Success!";
// 		// TODO show success/error message to user
// 		// TODO add validation/error handling
// 		console.log(`User ${username} created successfully`);
// 		return res.status(200).send();
// 	});
// });
//
//
// /* POST post_yardsale page */
// router.post('/post_yardsale', (req, res) => {
// 	var firstname = req.body.firstname;
// 	var lastname = req.body.lastname;
// 	var username = req.body.username;
// 	var phone = req.body.phone;
// 	var address = req.body.address;
// 	var city = req.body.city;
// 	var state = req.body.state;
// 	var zipcode = req.body.zipcode;
// 	var description = req.body.description;
// 	var date = req.body.date;
// 	var starttime = req.body.starttime;
// 	var endtime = req.body.endtime;
// 	var imgname = req.body.imgname;
//
// 	var newYardsale = new Yardsale();
// 	newYardsale.firstname = firstname;
// 	newYardsale.lastname = lastname;
// 	newYardsale.username = username;
// 	newYardsale.phone = phone;
// 	newYardsale.address = address;
// 	newYardsale.city = city;
// 	newYardsale.state = state;
// 	newYardsale.zipcode = zipcode;
// 	newYardsale.description = description;
// 	newYardsale.date = date;
// 	newYardsale.starttime = starttime;
// 	newYardsale.endtime = endtime;
// 	newYardsale.imgname = imgname;
//
// 	newYardsale.save(function (err, savedYardsale) {
// 		if (err) {
// 			console.log(err);
// 			return res.status(500).send();
// 		}
// 		// var msg = document.getElementsByClassName("msgDiv");
// 		// msg.html = "Success!";
// 		// TODO show success/error message to user
// 		// TODO add validation/error handling
// 		console.log(`${firstname}'s new yard sale posted successfully!`);
// 		return res.status(200).send();
// 	});
// });
//
//
// /*
// *
// * Function to find a User by their email address
// *
// * */
// function findUserByEmail(email) {
// 	if(email) {
// 		return new Promise((resolve, reject) => {
// 			User.findOne({ email: email })
// 				.exec((err, doc) => {
// 					if (err) return reject(err);
// 					if (doc) return reject(new Error('This email already exists. Please enter another email.'));
// 					else return resolve(email);
// 				});
// 		});
// 	}
// }

/* GET all yardsales*/
router.get("/yardsales", yardsaleController.all_yardsales);

module.exports = router;
