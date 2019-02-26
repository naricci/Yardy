const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/users.model');
var crypto = require('crypto'), hmac, signature;
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize }   = require('express-validator/filter');

// Controllers
// const signup_controller = require('../controllers/signup.controller');
// const favorites_controller = require('../controllers/favorites.controller');
const yardsales_controller = require('../controllers/yardsales.controller');
// const users_controller = require('../controllers/users.controller');

// Routes for views
// router.all('/', ctrlHome.home);
// router.all('/signup', ctrlHome.home);
// router.all('/signup', ctrlHome.view);

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Welcome!' });
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Sign Up!' });
});

/* GET favorites page. */
router.get('/favorites', function (req, res, next) {
  res.render('favorites', { title: 'Favorites' });
});

/* GET post_yardsale page */
router.get('/post_yardsale', function (req, res, next) {
  res.render('post_yardsale', { title: 'Post a Yard Sale' });
});

/* GET user account page. */
router.get('/account', function (req, res, next) {
  res.render('account', { title: 'User Account' });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Log In!' });
});

/* POST user registration page. */
router.post('/signup',[

  check('username','Username must be at least 8 chars long')
      .isLength({ min: 1 }),

  check('email')
      .isEmail().withMessage('Please enter a valid email address')
      .trim()
      .normalizeEmail()
      .custom(value => {
        return findUserByEmail(value).then(User => {
          //if user email already exists throw an error
        })
      }),
  check('password')
      .isLength({ min: 1 }).withMessage('Password must be at least 8 chars long')
      .matches(/\d/).withMessage('Password must contain one number')
      .custom((value,{req, loc, path}) => {
        if (value !== req.body.cpassword) {
          // throw error if passwords do not match
          throw new Error("Passwords don't match");
        } else {
          return value;
        }
      }),
], function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    res.json({status : "error", message : errors.array()});
  } else {
    hmac = crypto.createHmac("sha1", 'auth secret');
    var encpassword = '';
    if(req.body.password) {
      hmac.update(req.body.password);
      encpassword = hmac.digest("hex");
    }
    var document = {
      username:   req.body.username,
      email:       req.body.email,
      password:    encpassword,
    };

    var user = new User(document);
    user.save(function(error){
      console.log(user);
      if(error){
        throw error;
      }
      res.json({message : "Data saved successfully.", status : "success"});
    });
  }
});

/* POST post_yardsale page. */
router.post('/post_yardsale', function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        res.json({status : "error", message : errors.array()});
    } else {
        // hmac = crypto.createHmac("sha1", 'auth secret');
        // var encpassword = '';
        // if (req.body.password) {
        //     hmac.update(req.body.password);
        //     encpassword = hmac.digest("hex");
        // }
        var document = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zipcode: req.body.zipcode,
            description: req.body.description,
            date: req.body.date,
            starttime: req.body.starttime,
            endtime: req.body.endtime
        };

        var yardsale = new Yardsale(document);
        yardsale.save(function(error){
            console.log(yardsale);
            if(error){
                throw error;
            }
            res.json({message : "Yardsale posted successfully.", status : "success"});
        });
    }
});

/*
*
* Function to find a User by their email address
*
* */
function findUserByEmail(email) {
  if(email) {
    return new Promise((resolve, reject) => {
      User.findOne({ email: email })
          .exec((err, doc) => {
            if (err) return reject(err);
            if (doc) return reject(new Error('This email already exists. Please enter another email.'));
            else return resolve(email)
          })
    })
  }
}

module.exports = router;
