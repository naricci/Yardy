// const debug = require('debug')('yardy:message.controller');
import debugLib from 'debug';
const debug = debugLib('yardy:message.controller');
const messageController = {};

// exports.messages_get = (req, res, next) => {
messageController.messages_get = async (req, res, next) => {
	debug('Getting User\'s Messages');
	res.render('development');
};

export default messageController;
