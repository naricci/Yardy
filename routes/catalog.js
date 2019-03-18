const express = require('express');
const router = express.Router();

// Require Yardsale controller.
var yardsaleController = require('../controllers/yardsaleController');

// GET post_yardsale test page
// router.get('/yardsale_form', (req, res, next) => {
// 	res.render('yardsale_form');
// });

// Yardsale Routes
// GET catalog home page.
// router.get('/yardsale', yardsaleController.index);

// GET request for creating a Yardsale. NOTE This must come before routes that display Yardsale (uses id).
router.get('/yardsale/create', yardsaleController.yardsale_create_get);

// POST request for creating Yardsale.
router.post('/yardsale/create', yardsaleController.yardsale_create_post);

// GET request to delete Yardsale.
router.get('/yardsale/:id/delete', yardsaleController.yardsale_delete_get);

// POST request to delete Yardsale.
router.post('/yardsale/:id/delete', yardsaleController.yardsale_delete_post);

// GET request to update Yardsale.
router.get('/yardsale/:id/update', yardsaleController.yardsale_update_get);

// POST request to update Yardsale.
// router.post('/yardsale/:id/update', yardsaleController.yardsale_update_post);

// GET request for one Yardsale.
router.get('/yardsale/:id', yardsaleController.yardsale_detail);

// GET request for list of all Yardsales.
router.get('/yardsales', yardsaleController.yardsale_list);

/*try to display some yahdsales*/
router.get('/yardsale', yardsaleController.all_yardsales);

router.get('/yardsale_by_date', yardsaleController.all_yardsales_sorted);

module.exports = router;
