const express = require('express');
const router = express.Router();
// Models
const messageController = require('../controllers/messageController');

router.get('/:userId', messageController.messages_get);

module.exports = router;
