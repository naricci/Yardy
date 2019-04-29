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
				body('address', 'Address cannot be more than 250 characters.').isLength({ min: 0, max: 250 }),
				// .isAlphanumeric('en-US').withMessage('Address not valid.  Please enter a proper alpha-numeric address.'),
				body('address2', 'Address 2 cannot be more than 250 characters.').isLength({ min: 0, max: 250 }),
				body('city', 'City cannot be more than 25 characters.').isLength({ min: 0, max: 25 }),
				// body('state', 'Please select a state.').isEmpty(),
				body('zipcode', 'Zip Code is not valid.').isPostalCode('US'),
				// Sanitize fields with wildcard operator.
				sanitizeBody('*').trim().escape()
			];
		}
		case 'profilepic_post': {
			return [
				// Validate form fields.
				check('profilepic', 'Image name cannot be longer than 100 characters long.').isLength({ max: 50 }),
				// Sanitize fields.
				sanitizeBody('profilepic').toString(),
			];
		}
	}
};
