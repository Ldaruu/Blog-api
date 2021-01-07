const express = require('express');
const router = express.Router();
const multer = require('multer');
const withAuth = require('../middleware/withAuth');
const BlogPostsController = require('../controllers/blogPosts');
require('dotenv/config');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png ') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
	fileFilter: fileFilter,
});

router.get('/', BlogPostsController.blogPosts_get_all);

router.post(
	'/',
	withAuth,
	upload.single('postImage'),
	BlogPostsController.blogPost_create
);

router.get('/:postId', BlogPostsController.blogPosts_get_post);

router.patch('/:postId', withAuth, BlogPostsController.blogPosts_update_post);

router.delete('/:postId', withAuth, BlogPostsController.blogPosts_delete_post);

module.exports = router;
