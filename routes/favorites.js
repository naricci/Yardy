const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const userController = require('../controllers/userController');

// GET request for User favorites
router.get('/:userId', favoriteController.favorites_get);

// POST request for User favorites
router.post('/:userId', favoriteController.favorites_post);

// POST request to delete a User's favorite yard sale
router.post('/:userId/:yardsaleId', favoriteController.favorites_delete);

module.exports = router;
