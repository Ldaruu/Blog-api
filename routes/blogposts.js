const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const BlogPost = require('../models/blogPost');

router.get('/', (req, res, next) => {
	BlogPost.find()
		.exec()
		.then((docs) => {
			console.log(docs);
			res.status(200).json(docs);
		})
		.catch((err) => {
			// console.log(err);
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
			console.log(result);
			res.status(201).json({
				message: 'Post was created',
				post: blogPost,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
});

router.get('/:postId', (req, res, next) => {
	const id = req.params.postId;
	BlogPost.findById(id)
		.exec()
		.then((doc) => {
			console.log('From DB: ', doc);
			if (doc) {
				res.status(200).json(doc);
			} else {
				res.status(404).json({ message: 'Post does not exist!' });
			}
		})
		.catch((err) => {
			console.log(err);
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
			console.log(result);
			res.status(200).json(result);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.delete('/:postId', (req, res, next) => {
	const id = req.params.postId;
	BlogPost.remove({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

module.exports = router;
