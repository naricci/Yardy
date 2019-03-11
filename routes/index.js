var express = require('express');
var router = express.Router();
const yardsaleController = require('../controllers/yardsaleController');

/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('index', { title: 'Welcome!' });
});

/*try to display some yahdsales*/
router.get('/yardsale', yardsaleController.all_yardsales);

router.get('/yardsale_by_date', yardsaleController.all_yardsales_sorted);
