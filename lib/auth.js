var express = require('express');
var router = express.Router();

// Catch all requests pointed to 'delete' or 'update' page of our catalog entities,
// and run them through our authentication/authorization middleware chain.
// This route requires 'update' or 'delete' permission.
// e.g. /catalog/yardsale/:id/update
router.use(/^\/catalog\/(yardsale)\/([a-zA-Z0-9]{1,})\/(delete|update)/, [	// catalog / author|book|bookinstance|genre
	function(req, res, next) {
		// Get the operation from req.params object.
		req.requested_operation = req.params[2].toLowerCase();
		next();
	},
	confirmAuthentication

]);

router.use(/^\/catalog\/(yardsale)\/(create)/, [
	function(req, res, next) {
		next();
	},
	confirmAuthentication
]);


router.use(/^\/catalog\/(yardsale)\/([a-zA-Z0-9]{1,})/, [
	function(req, res, next) {
		next();
	},
	confirmAuthentication
]);

// Confirms that the user is authenticated.
function confirmAuthentication(req, res, next) {
	if (req.isAuthenticated()) {
		// Authenticated. Proceed to next function in the middleware chain.
		return next();
	} else {
		// Not authenticated. Redirect to login page and flash a message.
		req.flash('error', 'You need to login first!');
		res.redirect('/users/login');
	}
}

module.exports = router;
