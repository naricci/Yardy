/**************** Helper Functions ****************/

// Extract flash messages from req.flash and return an array of messages.
export function extractFlashMessages(req) {
	var messages = [];
	// Check if flash messages was sent. If so, populate them.
	var errorFlash = req.flash('error');
	var successFlash = req.flash('success');

	// Look for error flash.
	if (errorFlash && errorFlash.length) messages.push({ msg: errorFlash[0] });

	// Look for success flash.
	if (successFlash && successFlash.length) messages.push({ msg: successFlash[0] });

	return messages;
}

// Function to prevent user who already logged in from
// accessing login and register routes.
export function isAlreadyLoggedIn(req, res, next) {
	if (req.user && req.isAuthenticated()) res.redirect('/');
	else next();
}

// Function sends a JSON response
export function sendJSONresponse(res, status, content) {
	res.status(status);
	res.json(content);
}

// Function that returns the file extension of a filename as a string.
export function getFileExtension(filename) {
	let ext = /^.+\.([^.]+)$/.exec(filename);
	return ext === null ? '' : ext[1];
}
