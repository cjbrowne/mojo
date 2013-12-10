module.exports = function(mongoose) {
	var Schema = mongoose.Schema;
	var schemas= {
		User: new Schema({
			email: {type: String,unique:true},
			verified: Boolean,
			token: String,
			hash: String
		}),
		Billing: new Schema({
			userId: {type:Schema.Types.ObjectId,turnOn:false},
			subscription_status: {type:String,enum:["frozen","trial","full"]}
		})
	}
	return {
		User: mongoose.model('User',schemas.User),
		Billing: mongoose.model('Billing',schemas.Billing)
	}
}