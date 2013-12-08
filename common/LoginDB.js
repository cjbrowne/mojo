var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

module.exports = {
	User: mongoose.model('User',{
		userId: Schema.Types.ObjectId,
		email: String,
		verified: Boolean,
		token: String,
		hash: String
	})
}