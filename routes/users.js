const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const userController = require('../controllers/userController');
const validators = require('../middlewares/validators');

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
router.get('/:id/favorites', userController.favorites_get);

// POST request for User favorites
router.post('/:id/favorites', userController.favorites_post);

module.exports = router;
