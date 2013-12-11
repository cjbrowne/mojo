module.exports = {
	email: {
		
	},
	port: 80,
	hostname: "localhost",
	session_secret: "cookiedough",
	client: {
		login: {
			host: "localhost",
			// TODO: keep this in sync with ../login/config.js
			port: 5000
		}
	},
	redis: {
		password: "redispassword"
	}
}