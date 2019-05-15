// const express = require('express');
// const router = express.Router();
// const favoriteController = require('../controllers/favoriteController');
// const yardsaleController = require('../controllers/yardsaleController');
// const upload = require('../middlewares/multer');
// const validators = require('../middlewares/validators');

import { Router } from 'express';
import favoriteController from '../controllers/favoriteController';
import yardsaleController from '../controllers/yardsaleController';
import upload from '../middlewares/multer';
import validators from '../middlewares/validators';
const router = new Router();

// GET request for list of all Yardsales.
router.get('/', (req, res, next) => {
	yardsaleController.yardsale_list(req, res, next);
});

// GET request for creating a Yardsale.
router.get('/create', (req, res, next) => {
	yardsaleController.yardsale_create_get(req, res, next)
});

// POST request for creating Yardsale.
router.post('/create', validators('yardsale_create_post'), upload.single('imagename'), (req, res, next) => {
	yardsaleController.yardsale_create_post(req, res, next);
});

// GET request for one Yardsale.
router.get('/:id', (req, res, next) => {
	yardsaleController.yardsale_detail(req, res, next)
});

// POST request to delete Favorite.
router.post('/:id', (req, res, next) => {
	favoriteController.favorites_post(req, res, next)
});

// GET request to update Yardsale.
router.get('/:id/update', (req, res, next) => {
	yardsaleController.yardsale_update_get(req, res, next)
});

// POST request to update Yardsale with image upload..
router.post('/:id/update', validators('yardsale_update_post'), upload.single('imagename'), (req, res, next) => {
	yardsaleController.yardsale_update_post(req, res, next)
});

// GET request to delete Yardsale.
router.get('/:id/delete', (req, res, next) => {
	yardsaleController.yardsale_delete_get(req, res, next)
});

// POST request to delete Yardsale.
router.post('/:id/delete', (req, res, next) => {
	yardsaleController.yardsale_delete_post(req, res, next)
});

// module.exports = router;
export default router;
