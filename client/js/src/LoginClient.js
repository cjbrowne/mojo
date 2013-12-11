define("LoginClient",[],function() {
	var LoginClient = function(config) {this.config = config;};
	LoginClient.prototype = {
		socket: null,
		config: null,
		connected: false,
		connect: function() {
			this.socket = io.connect("http://" + this.config.host + ":" + this.config.port);
			this.connected = true;
		},
		getWorldList: function(cb) {
			console.log("requesting world list from server...");
			this.socket.emit('worlds');
			this.socket.on('worlds',function(data) {
				cb(data);
			});
		}
	};
	return LoginClient;
});