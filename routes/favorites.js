// const express = require('express');
// const router = express.Router();
// const favoriteController = require('../controllers/favoriteController');
import { Router } from 'express';
import favoriteController from '../controllers/favoriteController';
const router = new Router();

// GET request for User favorites
router.get('/:userId', (req, res, next) => {
	favoriteController.favorites_get(req, res, next);
});

// POST request for User favorites
router.post('/:userId', (req, res, next) => {
	favoriteController.favorites_post(req, res, next);
});

// POST request to delete a User's favorite yard sale
router.post('/:userId/:yardsaleId', (req, res, next) => {
	favoriteController.favorites_delete(req, res, next);
});

// module.exports = router;
export default router;
