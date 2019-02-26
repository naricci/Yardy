var express = require('express');
var router = express.Router();

var Yardsales = require('../models/yardsales.model');
const yardsales_controller = require('../controllers/yardsales.controller');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

/* GET all Yardsales */
router.get("/search", yardsales_controller.yardsale_search);

module.exports = router;