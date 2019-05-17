const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const indexController = require('../controllers/indexController');

/* GET home page search results */
router.get('/', indexController.search);

/* GET home page. */
router.get('/', indexController.index);

// POST request for User favorites
router.post('/',favoriteController.favorites_post);

// POST request for User favorites
// router.post('/', favoriteController.favorites_delete);

module.exports = router;
