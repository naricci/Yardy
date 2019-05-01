const { body, check } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.validate = (method) => {
	switch (method) {
		case 'register_post': {
			return [
				// Validate form fields.
				check('username', 'Username must be between 4-32 characters long.').isLength({ min: 4, max: 25 }),
				check('email', 'Please enter a valid email address.').isEmail().normalizeEmail(),
				check('password', 'Password must be between 4-25 characters long.').isLength({ min: 4, max: 25 }),
				check('cpassword', 'Password must be between 4-25 characters long.').isLength({ min: 4, max: 25 }),
				// Sanitize fields with wildcard operator.
				sanitizeBody('*').trim().escape()
			];
		}
		case 'update_post': {
			return [
				// Validate fields.
				body('email', 'Please enter a valid email address.').isEmail().normalizeEmail(),
				body('password', 'Password must be between 4-25 characters long.').isLength({ min: 4, max: 25 }),
				body('cpassword', 'Password must be between 4-25 characters long.').isLength({ min: 4, max: 25 }),
				body('firstname', 'First Name must be between 2-25 characters long.').isLength({ min: 2, max: 25 })
					.isAlpha().withMessage('First Name must strictly contain letters.').optional(),
				body('lastname', 'Last Name must be between 2-25 characters long.').isLength({ min: 2, max: 25 })
					 .isAlpha().withMessage('Last Name must strictly contain letters.').optional(),
				body('phone', 'Phone number is not valid.').isMobilePhone('en-US').optional(),
				body('address', 'Address cannot be more than 250 characters.').isLength({ min: 0, max: 250 }).optional(),
				// .isAlphanumeric('en-US').withMessage('Address not valid.  Please enter a proper alpha-numeric address.'),
				body('address2', 'Address 2 cannot be more than 250 characters.').isLength({ min: 0, max: 250 }).optional(),
				body('city', 'City cannot be more than 25 characters.').isLength({ min: 0, max: 25 }).optional(),
				// body('state', 'Please select a state.').isEmpty(),
				body('zipcode', 'Zip Code is not valid.').isPostalCode('US').optional(),
				// Sanitize fields with wildcard operator.
				sanitizeBody('*').trim().escape()
			];
		}
		case 'profilepic_post': {
			return [
				// Validate form fields.
				body('profilepic', 'Image name cannot be longer than 50 characters long.').isLength({ max: 50 }),
				// Sanitize fields.
				sanitizeBody('profilepic').toString(),
			];
		}
		case 'reset_post': {
			return [
				// First step of the password reset process.
				// Take username and email from form, and try to find a matching user.
				// Validate fields.
				body('username', 'Username must be between 4-32 characters long.').isLength({ min: 4, max: 32 }),
				body('email', 'Please enter a valid email address.').isEmail().normalizeEmail(),
				// Sanitize fields with wildcard operator.
				sanitizeBody('*').trim().escape(),
			];
		}
		case 'reset_post_final': {
			return [
				// Second and the final step of the password reset process.
				// Take userid, password and password_confirm fields from form,
				// and update the User record.
				body('password', 'Password must be between 4-32 characters long.').isLength({ min: 4, max: 32 }).trim(),
				body('cpassword', 'Password must be between 4-32 characters long.').isLength({ min: 4, max: 32 }).trim(),
				// Sanitize fields with wildcard operator.
				sanitizeBody('*').trim().escape(),
			];
		}
		case 'yardsale_create_post': {
			return [
				// Validate fields
				body('phone', 'Phone number is not valid.').isMobilePhone('en-US').optional(),
				body('zipcode', 'Please enter a valid 5-digit zip code.').isPostalCode('US'),
				body('date').optional({ checkFalsy: true }).isISO8601().withMessage('Please enter a valid date')
					.isAfter().withMessage('Please select a date that hasn\'t occurred yet.'),
				// // Sanitize fields.
				// sanitizeBody('phone').trim().escape(),
				// sanitizeBody('zipcode').toString(),
				sanitizeBody('date').toDate(),
				sanitizeBody('imagename').toString(),
			];
		}
		case 'yardsale_update_post': {
			return [
				// Validate form fields.
				body('phone', 'Phone number is not valid.').isMobilePhone('en-US').optional(),
				body('zipcode', 'Please enter a valid 5-digit zip code.').isPostalCode('US'),
				body('date', 'Date is not valid.').optional({ checkFalsy: true }).isISO8601()
				 	.isAfter().withMessage('Please select a date that hasn\'t occurred yet.'),
				body('imagename', 'Image name cannot be longer than 50 characters long.').isLength({ max: 50 }),
				// Sanitize fields.
				sanitizeBody('phone').toInt(),
				sanitizeBody('zipcode').toString(),
				sanitizeBody('date').toDate(),
				sanitizeBody('imagename').toString(),
				sanitizeBody('*').trim().escape(),
			];
		}
	}
};
