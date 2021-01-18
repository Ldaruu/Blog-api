const BlogPost = require('../models/blogPost');
const mongoose = require('mongoose');

const User = require('../models/user');

exports.blogPosts_get_all = (req, res, next) => {
	BlogPost.find()
		.sort({ date: 'desc' })
		.select('_id title content postImage slug')
		.populate('user_account', '_id userName')
		.exec()
		.then((data) => {
			const response = {
				count: data.length,
				posts: data.map((d) => {
					return {
						id: d._id,
						slug: d.slug,
						title: d.title,
						content: d.content,
						postImage: d.postImage,
						user_account: d.user_account,
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
};

exports.blogPost_create = (req, res, next) => {
	imagePath = req.file ? req.file.path : null;
	let blogPost = null;
	if (req.body.title && req.body.content && req.userData.userId) {
		blogPost = new BlogPost({
			_id: new mongoose.Types.ObjectId(),
			title: req.body.title,
			content: req.body.content,
			postImage: imagePath,
			user_account: req.userData.userId,
		});
	}
	blogPost
		.save()
		.then((result) => {
			res.status(201).json({
				message: 'Post was created!',
				post: {
					_id: result._id,
					slug: result.slug,
					title: result.title,
					content: result.content,
					postImage: result.postImage,
					user_account: { _id: result.user_account },
				},
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
};

exports.blogPosts_get_post = (req, res, next) => {
	const slug = req.params.slug;
	BlogPost.find({ slug: slug })
		.select('_id title content postImage slug')
		.populate('user_account', '_id userName')
		.exec()
		.then((data) => {
			if (data) {
				res.status(200).json(data[0]);
			} else {
				res.status(404).json({ message: 'Post does not exist!' });
			}
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};

exports.blogPosts_update_post = (req, res, next) => {
	const id = req.params.postId;
	let image = req.file ? req.file.path : req.body.postImage;
	let updateOps = {};
	updateOps = {
		title: req.body.title,
		content: req.body.content,
		postImage: image === 'null' || image === 'undefined' ? null : image,
	};
	// for (const ops of req.body) {
	// 	updateOps[ops.propName] = ops.value;
	// }
	BlogPost.findOneAndUpdate(
		{ _id: id, user_account: { _id: req.userData.userId } },
		{ $set: updateOps },
		{ new: true, runValidators: true }
	)
		.select('_id title content postImage slug')
		.populate('user_account', '_id userName')
		.exec()
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
};

exports.blogPosts_delete_post = (req, res, next) => {
	const id = req.params.postId;
	BlogPost.findOneAndDelete({
		_id: id,
		user_account: { _id: req.userData.userId },
	})
		.then((result) => {
			if (result)
				res.status(200).json({ message: 'Post deleted!', result: result });
			else res.status(401).json({ message: 'Authorization error' });
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};
