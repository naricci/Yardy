const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

/* GET home page search results */
router.get('/', indexController.search);

/* GET home page. */
router.get('/', indexController.index);

// GET request for User favorites
// router.get('/users/:id/favorites', indexController.favorites_get);

// POST request for User favorites
router.post('/', indexController.favorites_post);

// POST request for User favorites
router.post('/', indexController.favorites_delete);

module.exports = router;

