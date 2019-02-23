var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/users.model');
var crypto = require('crypto'), hmac, signature;
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize }   = require('express-validator/filter');

/* GET Sign Up page. */
router.get('/signup', function(req, res, next) {
    res.send('signup');
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
        user.save(function(error) {
            console.log(user);

            if (error) {
                throw error;
            }
            res.json({message : "Data saved successfully.", status : "success"});
        });
    }
});

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