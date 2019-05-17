const debug = require('debug')('yardy:message.controller');

exports.messages_get = (req, res, next) => {
	debug('Getting User\'s Messages');
	res.render('development');
};
