// const express = require('express');
// const router = express.Router();
// // Models
// const messageController = require('../controllers/messageController');

import { Router } from 'express';
import messageController from '../controllers/messageController';
const router = new Router();

router.get('/:userId', (req, res, next) => {
	messageController.messages_get(req, res, next);
});

// module.exports = router;
export default router;
