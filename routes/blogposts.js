const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'GET request Post page',
	});
});

router.post('/', (req, res, next) => {
	res.status(200).json({
		message: 'POST request Post page',
	});
});

router.get('/:postId', (req, res, next) => {
	const id = rew.param.postId;
});

router.patch('/:postId', (req, res, next) => {
	res.status(200).json({
		message: 'Post was updated successfully!',
	});
});
router.delete('/:postId', (req, res, next) => {
	res.status(200).json({
		message: 'Post was Deleted!',
	});
});

module.exports = router;
