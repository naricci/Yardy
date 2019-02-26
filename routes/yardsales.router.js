var express = require('express');
var router = express.Router();

const yardsales_controller = require('../controllers/yardsales.controller');
const users_controller = require('../controllers/users.controller');

/* GET all Yardsales */
router.get('/', function(req, res, next) {
    res.send('respond with a resource')
})