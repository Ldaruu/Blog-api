const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/withAuth');
const BlogPostsController = require('../controllers/blogPosts');
const fileUploads = require('../middleware/fileUploads');
require('dotenv/config');

router.get('/', BlogPostsController.blogPosts_get_all);

router.post(
	'/',
	// withAuth,
	fileUploads.imageUploads,
	BlogPostsController.blogPost_create
);

router.get('/:slug', BlogPostsController.blogPosts_get_post);

router.patch(
	'/:postId',
	// withAuth,
	fileUploads.imageUploads,
	BlogPostsController.blogPosts_update_post
);

router.delete('/:postId', BlogPostsController.blogPosts_delete_post);

module.exports = router;
