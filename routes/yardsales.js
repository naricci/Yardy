const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const yardsaleController = require('../controllers/yardsaleController');
const upload = require('../middlewares/multer');
const validators = require('../middlewares/validators');

// GET request for list of all Yardsales.
router.get('/', yardsaleController.yardsale_list);

// GET request for creating a Yardsale.
router.get('/create', yardsaleController.yardsale_create_get);

// POST request for creating Yardsale.
router.post('/create', validators('yardsale_create_post'), upload.single('imagename'), yardsaleController.yardsale_create_post);

// GET request for one Yardsale.
router.get('/:id', yardsaleController.yardsale_detail);

// POST request to delete Favorite.
router.post('/:id', favoriteController.favorites_post);

// GET request to update Yardsale.
router.get('/:id/update', yardsaleController.yardsale_update_get);

// POST request to update Yardsale with image upload..
router.post('/:id/update', validators('yardsale_update_post'), upload.single('imagename'), yardsaleController.yardsale_update_post);

// GET request to delete Yardsale.
router.get('/:id/delete', yardsaleController.yardsale_delete_get);

// POST request to delete Yardsale.
router.post('/:id/delete', yardsaleController.yardsale_delete_post);

module.exports = router;
