const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const blogpostRouter = require('./routes/blogposts');
const usersRouter = require('./routes/users');
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

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', process.env.ORIGIN);
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	if (req.method === 'OPTIONS') {
		res.header(
			'Access-Control-Allow-Methods',
			' GET, POST, PUT, PATCH, DELETE'
		);
		return res.status(200).json({});
	}
	next();
});

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
