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
				if (err || !result) {
					return res.status(401).json({ error: 'Not Authenticated' });
				}
				if (result) {
					const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
					return res
						.status(200)
						.cookie('auth_token', token, {
							maxAge: 365 * 24 * 60 * 60 * 1000,
							httpOnly: true,
							signed: true,
						})
						.json({
							id: user._id,
							userName: user.userName,
						});
				}
			});
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
};

exports.auto_login = (req, res, next) => {
	try {
		const cookie = req.signedCookies.auth_token;
		const decoded = jwt.verify(cookie, process.env.SECRET_KEY);
		User.findById(decoded.userId)
			.exec()
			.then((user) => {
				if (user.length < 1) {
					return res.status(401).json({ error: 'Log in first!' });
				} else {
					return res
						.status(200)
						.json({ id: user._id, userName: user.userName });
				}
			})
			.catch((err) => {
				res.status(500).json({ error: err });
			});
	} catch (err) {
		return res.status(401).json({ error: 'Not logged in!' });
	}
};

exports.user_logout = (req, res, next) => {
	res.clearCookie('auth_token');
	res.status(200).json({ logged_out: true, message: 'Logged out' });
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
