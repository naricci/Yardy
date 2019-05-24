const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

// GET request for User favorites
router.get('/:userId', favoriteController.favorites_get);

// POST request for User favorites
router.post('/:userId', favoriteController.favorites_post);

// DELETE request to delete a User's favorite yard sale
router.all('/:userId/delete/:favId?', favoriteController.favorites_delete);

module.exports = router;
