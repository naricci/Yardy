const express = require('express');
const router = express.Router();
// Models
const favoriteController = require('../controllers/favoriteController');
const indexController = require('../controllers/indexController');
// Memcache
// const memjs = require('memjs');
// const mc = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
// 	failover: true,  // default: false
// 	timeout: 1,      // default: 0.5 (seconds)
// 	keepAlive: true  // default: false
// });

/* GET home page search results */
router.get('/', indexController.search);

/* GET home page. */
router.get('/', indexController.index);

// POST request for User favorites
router.post('/', favoriteController.favorites_post);

// POST request for User favorites
// router.post('/', favoriteController.favorites_delete);

// var cacheView = function(req, res, next) {
// 	var view_key = '_view_cache_' + req.originalUrl || req.url;
// 	mc.get(view_key, function(err, val) {
// 		if(err == null && val != null) {
// 			// Found the rendered view -> send it immediately
// 			res.send(val.toString('utf8'));
// 			return;
// 		}
// 		// Cache the rendered view for future requests
// 		res.sendRes = res.send;
// 		res.send = function(body){
// 			mc.set(view_key, body, {expires:0}, function(err, val){});
// 			res.sendRes(body);
// 		};
// 		next();
// 	});
// };

module.exports = router;

