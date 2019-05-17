const express = require('express');
const messageController = require('../controllers/messageController');
const router = express.Router();

router.get('/:userId', messageController.messages_get);

module.exports = router;
