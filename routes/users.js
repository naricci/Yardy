const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const favoriteController = require('../controllers/favoriteController');
const userController = require('../controllers/userController');
const validators = require('../middlewares/validators');

// Handler for all types of requests pointed to '/' route.
router.all('/', (req, res, next) => {
	res.redirect('/');
});

// GET request for login page.
router.get('/login', userController.login_get);

// POST request for login page.
router.post('/login', userController.login_post);

// GET request for logout page.
router.get('/logout', userController.logout_get);

// GET request for create User.
router.get('/register', userController.register_get);

// POST request for create User.
router.post('/register', validators.validate('register_post'), userController.register_post);

// GET request for reset User password.
router.get('/reset', userController.reset_get);

// POST request for reset User password (1st step).
router.post('/reset', validators.validate('reset_post'), userController.reset_post);

// POST request for reset User password (2nd step).
router.post('/resetfinal', userController.reset_post_final);

// GET request for User permission reminder page.
router.get('/stop', userController.warning);

// GET request for a specific User.
router.get('/:id', userController.user_profile);

// GET request for update User.
router.get('/:id/update', userController.update_get);

// POST request for update User.
router.post('/:id/update', validators.validate('update_post'), userController.update_post);

// GET request for User updating profile pic
router.get('/:id/profilepic', userController.profilepic_get);

// POST request for User updating profile pic
router.post('/:id/profilepic', validators.validate('profilepic_post'), upload.single('profilepic'), userController.profilepic_post);

// GET request for User favorites
router.get('/:userId/favorites', favoriteController.favorites_get);

// POST request for User favorites
router.post('/:userId/favorites', favoriteController.favorites_post);

// POST request to delete a User's favorite yard sale
router.post('/:userId/favorites', favoriteController.favorites_delete);
// router.post('/:id/favorites/:fav_id?', favoriteController.favorites_delete);

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get('/auth/facebook', userController.facebook_auth);

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/auth/facebook/callback', userController.facebook_callback);

// Redirect user to Twitter for authentication.
router.get('/auth/twitter', userController.twitter_auth);

// Returns Twitter user data through callback.
router.get('/auth/twitter/callback', userController.twitter_callback);

// locally --------------------------------
// app.get('/connect/local', function(req, res) {
// 	res.render('connect-local.ejs', { message: req.flash('loginMessage') });
// });
// app.post('/connect/local', passport.authenticate('local-signup', {
// 	successRedirect : '/profile', // redirect to the secure profile section
// 	failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
// 	failureFlash : true // allow flash messages
// }));
//
// // facebook -------------------------------
//
// // send to facebook to do the authentication
// app.get('/connect/facebook', passport.authorize('facebook', {
// 	scope : ['public_profile', 'email']
// }));
//
// // handle the callback after facebook has authorized the user
// app.get('/connect/facebook/callback',
// 	passport.authorize('facebook', {
// 		successRedirect : '/profile',
// 		failureRedirect : '/'
// 	}));

module.exports = router;
