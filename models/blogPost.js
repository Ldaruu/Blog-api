const mongoose = require('mongoose')

const blogPostSchema = mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
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
	postImage: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('BlogPost', blogPostSchema)
