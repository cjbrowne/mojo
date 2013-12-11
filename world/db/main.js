module.exports = function(mongoose) {
	var Schema = mongoose.Schema;
	var schemas = {
		Player: new Schema({

		}),
		Character: new Schema({

		})
	}
	return {
		Player: mongoose.model('Player',schemas.Player),
		Character: mongoose.model('Character',schemas.Character)
	}
}