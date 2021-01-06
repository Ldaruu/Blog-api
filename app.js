const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');
const blogpostRouter = require('./routes/blogposts');

const app = express();

app.use('/posts', blogpostRouter);

app.get('/', (req, res) => {
	res.send('Helloo there!');
});

app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
		},
	});
});

try {
	mongoose.connect(
		process.env.DB_SERVER,
		{ useNewUrlParser: true, useUnifiedTopology: true },
		() => {
			console.log('Connected to the DB');
		}
	);
} catch (error) {
	console.log('Could not connect to DB ERROR: ', error.message);
}

module.exports = app;
