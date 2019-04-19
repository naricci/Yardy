const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
// Multer ships with storage engines DiskStorage and MemoryStorage
// And Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

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
router.post('/register', userController.register_post);

// GET request for reset User password.
router.get('/reset', userController.reset_get);

// POST request for reset User password (1st step).
router.post('/reset', userController.reset_post);

// POST request for reset User password (2nd step).
router.post('/resetfinal', userController.reset_post_final);

// GET request for User permission reminder page.
router.get('/stop', userController.warning);

// GET request for a specific User.
router.get('/:id', userController.user_profile);

// GET request for update User.
router.get('/:id/update', userController.update_get);

// POST request for update User.
router.post('/:id/update', userController.update_post);

// GET request for User updating profile pic
router.get('/:id/profilepic', userController.profilepic_get);

// POST request for User updating profile pic
// router.post('/:id/profilepic', userController.profilepic_post);
router.post('/:id/profilepic', upload.single('profilepic'), userController.profilepic_post);

// GET request for User favorites
router.get('/:id/favorites', userController.favorites_get);

// POST request for User favorites
router.post('/:id/favorites', userController.favorites_post);

module.exports = router;
