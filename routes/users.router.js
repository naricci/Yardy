var express = require('express');
var router = express.Router();

const signup_controller = require('../controllers/signup.controller');
const favorites_controller = require('../controllers/favorites.controller');
const yardsales_controller = require('../controllers/yardsales.controller');
const users_controller = require('../controllers/users.controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET one user */
router.get('/:id', users_controller.user_info);

/* UPDATE one user */
router.put('/:id/update', users_controller.user_update);

/* DELETE one user */
router.delete('/:id/delete', users_controller.user_delete);

// a simple test url to check that all files are communicating properly
//router.get('/test', users_controller);

module.exports = router;
