const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv/config');

const User = require('../models/user');

exports.user_signUp = (req, res, next) => {
	User.find({ email: req.body.email })
		.exec()
		.then((user) => {
			if (user.length >= 1) {
				return res.status(422).json({ message: 'Email already exists' });
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({ error: err });
					} else {
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							email: req.body.email,
							password: hash,
							userName: req.body.userName,
						});
						user
							.save()
							.then((result) => {
								console.log('User: ', result);
								res.status(201).json({
									message: 'User Account was successfully created!',
									user: {
										userName: result.userName,
										email: result.email,
									},
								});
							})
							.catch((err) => {
								res.status(500).json({ error: err });
							});
					}
				});
			}
		});
};

exports.user_login = (req, res, next) => {
	User.findOne({ email: req.body.email })
		.exec()
		.then((user) => {
			if (user.length < 1) {
				return res.status(401).json({ error: 'Not Authenticated' });
			}
			bcrypt.compare(req.body.password, user.password, (err, result) => {
				if (err) {
					return res.status(401).json({ error: 'Not Authenticated' });
				}
				if (result) {
					const token = jwt.sign(
						{
							userId: user._id,
							email: user.email,
							userName: user.userName,
						},
						process.env.SECRET_KEY,
						{ expiresIn: '2h' }
					);
					return res.status(200).json({
						message: 'Authenticated User',
						token: token,
						user: {
							id: user._id,
							userName: user.userName,
						},
					});
				}
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
};

exports.user_delete = (req, res, next) => {
	User.deleteOne({ _id: req.params.userId })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: 'User deleted',
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
};
