const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/withAuth');
const fileUploads = require('../middleware/fileUploads');

const UserController = require('../controllers/users');

router.post('/signup', fileUploads.imageUploads, UserController.user_signUp);

router.post('/login', UserController.user_login);

router.post('/auto_login', UserController.auto_login);

router.delete('/logout', UserController.user_logout);

router.delete('/:userId', withAuth, UserController.user_delete);

module.exports = router;
