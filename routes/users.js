// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');
// const validators = require('../middlewares/validators');
// const upload = require('../middlewares/multer');

import { Router } from 'express';
import userController from '../controllers/userController';
import validators from '../middlewares/validators';
import upload from '../middlewares/multer';
const router = new Router();

// Handler for all types of requests pointed to '/' route.
router.all('/',(req, res, next) => {
	res.redirect('/');
});

// GET request for login page.
router.get('/login',(req, res, next) => {
	userController.login_get(req, res, next);
});

// POST request for login page.
router.post('/login',(req, res, next) => {
	userController.login_post(req, res, next);
});

// GET request for logout page.
router.get('/logout',(req, res, next) => {
	userController.logout_get(req, res, next);
});

// GET request for create User.
router.get('/register',(req, res, next) => {
	userController.register_get(req, res, next);
});

// POST request for create User.
router.post('/register',validators('register_post'), (req, res, next) => {
	userController.register_post(req, res, next);
});

// GET request for reset User password.
router.get('/reset', (req, res, next) => {
	userController.reset_get(req, res, next);
});

// POST request for reset User password (1st step).
router.post('/reset',validators('reset_post'), (req, res, next) => {
	userController.reset_post(req, res, next);
});

// POST request for reset User password (2nd step).
router.post('/resetfinal',(req, res, next) => {
	userController.reset_post_final(req, res, next);
});

// GET request for User permission reminder page.
router.get('/stop', (req, res, next) => {
	userController.warning(req, res, next);
});

// GET request for a specific User.
router.get('/:id', (req, res, next) => {
	userController.user_profile(req, res, next);
});

// GET request for update User.
router.get('/:id/update', (req, res, next) => {
	userController.update_get(req, res, next);
});

// POST request for update User.
router.post('/:id/update', validators('update_post'), (req, res, next) => {
	userController.update_post(req, res, next);
});

// GET request for User updating profile pic
router.get('/:id/profilepic', (req, res, next) => {
	userController.profilepic_get(req, res, next);
});

// POST request for User updating profile pic
router.post('/:id/profilepic', validators('profilepic_post'), upload.single('profilepic'), (req, res, next) => {
	userController.profilepic_post(req, res, next);
});

// GET request for User favorites
// router.get('/:userId/favorites', favoriteController.favorites_get);

// POST request for User favorites
// router.post('/:userId/favorites', favoriteController.favorites_post);

// POST request to delete a User's favorite yard sale
// router.post('/:userId/favorites', favoriteController.favorites_delete);
// router.post('/:id/favorites/:fav_id?', favoriteController.favorites_delete);

// Redirect the user to Facebook for authentication.
router.get('/auth/facebook', (req, res, next) => {
	userController.facebook_auth(req, res, next);
});

// Facebook will redirect the user to this URL after approval.
router.get('/auth/facebook/callback', (req, res, next) => {
	userController.facebook_callback(req, res, next);
});

// Redirect user to Twitter for authentication.
router.get('/auth/twitter', (req, res, next) => {
	userController.twitter_auth(req, res, next);
});

// Twitter will redirect the user to this URL after approval.
router.get('/auth/twitter/callback', (req, res, next) => {
	userController.twitter_callback(req, res, next);
});

// Connect Accounts when already logged in Routes
router.get('/connect/local', (req, res, next) => {
	userController.connect_local_get(req, res, next);
});

router.post('/connect/local', (req, res, next) => {
	userController.connect_local_post(req, res, next);
});

router.get('/connect/facebook', (req, res, next) => {
	userController.connect_facebook_get(req, res, next);
});

router.get('/connect/facebook/callback', (req, res, next) => {
	userController.connect_facebook_callback(req, res, next);
});

router.get('/connect/twitter', (req, res, next) => {
	userController.connect_twitter_get(req, res, next);
});

router.get('/connect/twitter/callback', (req, res, next) => {
	userController.connect_twitter_callback(req, res, next);
});

// Unlink Accounts Routes
router.get('/unlink/local', (req, res, next) => {
	userController.unlink_local_get(req, res, next);
});

router.get('/unlink/facebook', (req, res, next) => {
	userController.unlink_facebook_get(req, res, next);
});

router.get('/unlink/twitter', (req, res, next) => {
	userController.unlink_twitter_get(req, res, next);
});

// module.exports = router;
export default router;
