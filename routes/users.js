const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv/config');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
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
});

module.exports = router;
