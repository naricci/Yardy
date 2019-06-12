const express = require('express');
const userController = require('../controllers/userController');
const validators = require('../middlewares/validators');
const upload = require('../middlewares/multer');
const router = express.Router();

// Handler for all types of requests pointed to '/' route.
router.all('/', (req, res) => {
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
router.post('/register',validators('register_post'), userController.register_post);

// GET request for reset User password.
router.get('/reset', userController.reset_get);

// POST request for reset User password (1st step).
router.post('/reset',validators('reset_post'), userController.reset_post);

// POST request for reset User password (2nd step).
router.post('/resetfinal', userController.reset_post_final);

// GET request for User permission reminder page.
router.get('/stop', userController.warning);

// GET request for a specific User.
router.get('/:id', userController.user_profile);

// GET request for update User.
router.get('/:id/update', userController.update_get);

// POST request for update User.
router.post('/:id/update', validators('update_post'), userController.update_post);

// GET request for User updating profile pic
router.get('/:id/profilepic', userController.profilepic_get);

// POST request for User updating profile pic
router.post('/:id/profilepic', validators('profilepic_post'), upload.single('profilepic'), userController.profilepic_post);

// DELETE request for User updating profile pic
router.get('/:id/profilepic/delete?', userController.profilepic_delete);

// Redirect the user to Facebook for authentication.
router.get('/auth/facebook', userController.facebook_auth);

// Facebook will redirect the user to this URL after approval.
router.get('/auth/facebook/callback', userController.facebook_callback);

// Redirect user to Twitter for authentication.
router.get('/auth/twitter', userController.twitter_auth);

// Twitter will redirect the user to this URL after approval.
router.get('/auth/twitter/callback', userController.twitter_callback);

// Connect Accounts when already logged in Routes
router.get('/connect/local', userController.connect_local_get);

router.post('/connect/local', userController.connect_local_post);

router.get('/connect/facebook', userController.connect_facebook_get);

router.get('/connect/facebook/callback', userController.connect_facebook_callback);

router.get('/connect/twitter',userController.connect_twitter_get);

router.get('/connect/twitter/callback', userController.connect_twitter_callback);

// Unlink Accounts Routes
router.get('/unlink/local', userController.unlink_local_get);

router.get('/unlink/facebook', userController.unlink_facebook_get);

router.get('/unlink/twitter', userController.unlink_twitter_get);

// GET User DELETE page
router.get('/:id/delete_account', userController.delete_account_get);

module.exports = router;
