const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const blogpostRouter = require('./routes/blogposts');
const usersRouter = require('./routes/users');
const cors = require('cors');
require('dotenv/config');

try {
	mongoose.connect(
		process.env.DB_SERVER,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		},
		() => {
			console.log('Connected to the DB');
		}
	);
} catch (error) {
	console.log('Could not connect to DB ERROR: ', error.message);
}

app.use(cors({ origin: process.env.ORIGIN }));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//ROUTERS
app.use('/posts', blogpostRouter);
app.use('/user', usersRouter);

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

module.exports = app;
