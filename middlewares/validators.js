const { body, check } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.validate = (method) => {
	switch (method) {
		case 'register_post': {
			return [
				// Validate form fields.
				body('username', 'Username must be between 4-32 characters long.').isLength({ min: 4, max: 25 }),
				body('email', 'Please enter a valid email address.').isEmail(),
				body('password', 'Password must be between 4-25 characters long.').isLength({ min: 4, max: 25 }),
				body('cpassword', 'Password must be between 4-25 characters long.').isLength({ min: 4, max: 25 }),
				// Sanitize fields with wildcard operator.
				sanitizeBody('*').trim().escape()
			];
		}
		case 'update_post': {
			return [
				// Validate fields.
				body('email', 'Please enter a valid email address.').isEmail(),
				body('password', 'Password must be between 4-25 characters long.').isLength({ min: 4, max: 25 }),
				body('cpassword', 'Password must be between 4-25 characters long.').isLength({ min: 4, max: 25 }),
				body('firstname', 'First Name must be between 2-25 characters long.').isLength({ min: 2, max: 25 })
					.isAlpha().withMessage('First Name must strictly contain letters.'),
				body('lastname', 'Last Name must be between 2-25 characters long.').isLength({ min: 2, max: 25 })
					 .isAlpha().withMessage('Last Name must strictly contain letters.'),
				body('phone', 'Phone number is not valid.').isMobilePhone('en-US'),
				// TODO - Finish address, address2, city, & state validation
				body('zipcode', 'Zip Code must be 5 digits long.').isLength({ min: 5, max: 5 })
					.isNumeric().withMessage('Please enter a valid 5-digit US zip code.'),
				// Sanitize fields with wildcard operator.
				sanitizeBody('*').trim().escape()
			];
		}
	}
};
