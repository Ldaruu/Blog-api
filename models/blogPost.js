const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types._ObjectId,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
