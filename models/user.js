const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
	},
	password: {
		type: String,
		required: true,
	},
	userName: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('User', userSchema)
