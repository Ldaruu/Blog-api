const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('dotenv/config');

const BlogPost = require('../models/blogPost');

router.get('/', (req, res, next) => {
	BlogPost.find()
		.select('_id title content')
		.exec()
		.then((data) => {
			const response = {
				count: data.length,
				posts: data.map((d) => {
					return {
						id: d._id,
						title: d.title,
						content: d.content,
						request: {
							type: 'GET',
							url: process.env.API_URL + '/posts/' + d._id,
						},
					};
				}),
			};
			res.status(200).json(response);
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
});

router.post('/', (req, res, next) => {
	const blogPost = new BlogPost({
		_id: new mongoose.Types.ObjectId(),
		title: req.body.title,
		content: req.body.content,
	});
	blogPost
		.save()
		.then((result) => {
			res.status(201).json({
				message: 'Post was created!',
				post: {
					id: result._id,
					title: result.title,
					content: result.content,
					request: {
						type: 'GET',
						url: process.env.API_URL + '/posts/' + result._id,
					},
				},
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

router.get('/:postId', (req, res, next) => {
	const id = req.params.postId;
	BlogPost.findById(id)
		.select('_id title content')
		.exec()
		.then((data) => {
			if (data) {
				res.status(200).json(data);
			} else {
				res.status(404).json({ message: 'Post does not exist!' });
			}
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
});

router.patch('/:postId', (req, res, next) => {
	const id = req.params.postId;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	BlogPost.updateOne({ _id: id }, { $set: updateOps })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: 'Post was updated!',
				request: {
					type: 'GET',
					url: process.env.API_URL + '/posts/' + id,
				},
			});
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.delete('/:postId', (req, res, next) => {
	const id = req.params.postId;
	BlogPost.deleteOne({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json({ message: 'Post deleted!' });
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
});

module.exports = router;
