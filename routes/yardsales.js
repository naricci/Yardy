var express = require('express');
var router = express.Router();

const yardsaleController = require('../controllers/yardsaleController');

router.get('/', yardsaleController.all_yardsales);

module.exports = router;