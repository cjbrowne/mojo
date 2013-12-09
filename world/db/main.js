module.exports = function(mongoose) {
	return {
		Player: mongoose.model('Player'),
		Character: mongoose.model('Character')
	}
}