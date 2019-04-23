const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexController.index);

/* GET home page search results */
router.post('/', indexController.search);

module.exports = router;

