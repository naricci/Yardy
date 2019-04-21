const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const yardsaleController = require('../controllers/yardsaleController');

// GET request for list of all Yardsales.
router.get('/yardsales', yardsaleController.yardsale_list);

// GET request for creating a Yardsale.
router.get('/yardsale/create', yardsaleController.yardsale_create_get);

// POST request for creating Yardsale.
router.post('/yardsale/create', yardsaleController.yardsale_create_post);

// GET request for one Yardsale.
router.get('/yardsale/:id', yardsaleController.yardsale_detail);

// GET request to update Yardsale.
router.get('/yardsale/:id/update', yardsaleController.yardsale_update_get);

// POST request to update Yardsale.
router.post('/yardsale/:id/update', upload.single('imagename'), yardsaleController.yardsale_update_post);

// GET request to delete Yardsale.
router.get('/yardsale/:id/delete', yardsaleController.yardsale_delete_get);

// POST request to delete Yardsale.
router.post('/yardsale/:id/delete', yardsaleController.yardsale_delete_post);

/*try to display some yahdsales*/
router.get('/yardsale', yardsaleController.all_yardsales);
router.get('/yardsale_by_date', yardsaleController.all_yardsales_sorted);

module.exports = router;
