const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const yardsaleController = require('../controllers/yardsaleController');

// GET request for list of all Yardsales.
router.get('/', yardsaleController.yardsale_list);

// GET request for creating a Yardsale.
router.get('/create', yardsaleController.yardsale_create_get);

// POST request for creating Yardsale.
router.post('/create', upload.single('imagename'), yardsaleController.yardsale_create_post);

// GET request for one Yardsale.
router.get('/:id', yardsaleController.yardsale_detail);

// GET request to update Yardsale.
router.get('/:id/update', yardsaleController.yardsale_update_get);

// POST request to update Yardsale.
router.post('/:id/update', upload.single('imagename'), yardsaleController.yardsale_update_post);

// GET request to delete Yardsale.
router.get('/:id/delete', yardsaleController.yardsale_delete_get);

// POST request to delete Yardsale.
router.post('/:id/delete', yardsaleController.yardsale_delete_post);

module.exports = router;
