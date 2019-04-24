const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

/* GET home page search results */
router.get('/', indexController.search);

/* GET home page. */
router.get('/', indexController.index);

module.exports = router;

