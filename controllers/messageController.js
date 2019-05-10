const debug = require('debug')('yardy:message.controller');
// Models
const User = require('../models/user');

exports.messages_get = (req, res, next) => {
	debug('Getting User\'s Messages');
	res.render('development');
};
