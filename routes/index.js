// const express = require('express');
// const router = express.Router();
// // Models
// const favoriteController = require('../controllers/favoriteController');
// const indexController = require('../controllers/indexController');

import { Router } from 'express';
import favoriteController from '../controllers/favoriteController';
import indexController from '../controllers/indexController';
const router = new Router();

/* GET home page search results */
router.get('/', (req, res, next) => {
	indexController.search(req, res, next);
});

/* GET home page. */
router.get('/', (req, res, next) => {
	indexController.index(req, res, next);
});

// POST request for User favorites
router.post('/', (req, res, next) => {
	favoriteController.favorites_post(req, res, next);
});

// POST request for User favorites
// router.post('/', favoriteController.favorites_delete);

// module.exports = router;
export default router;
