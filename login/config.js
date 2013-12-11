var worldConfig = require('../world/config.js');
module.exports = {
	port: 5000,
	redis: {
		host: "localhost",
		port: 6379,
		pass: "redispassword",
		db: 2
	},
	cookieSecret: "cookiedough",
	mongoose: {
		connect_string: "mongodb://localhost/loginDB"
	},
	world: worldConfig
}