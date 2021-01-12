const mongoose = require('mongoose');
slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
(Schema = mongoose.Schema),
	(blogPostSchema = mongoose.Schema({
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		title: {
			type: String,
			required: true,
			unique: true,
		},
		content: {
			type: String,
			required: true,
		},
		postImage: {
			type: String,
			required: false,
		},
		date: {
			type: Date,
			default: Date.now,
		},
		slug: {
			type: String,
			slug: 'title',
			unique: true,
		},
	}));

module.exports = mongoose.model('BlogPost', blogPostSchema);
