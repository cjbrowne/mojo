define("GetConfig",[],function() {
	var GetConfig = function() {};
	GetConfig.prototype = {
		login: null,
		world: null,
		ready: false,
		retrieve: function(which) {
			var self = this;
			$.get("/client_config/" + which, function(response) {
				if(self.indexOf(which) != -1)
					(self[which] = response) && (self.ready = true);
				else
					throw new Error("Server did not respond with config for " + which);
			});
		},
		retrieveAll: function(cb) {
			var self = this;
			$.get("/client_config/",function(response) {
				self.login = response.login;
				self.world = response.world;
				cb(self);
			});
		}
	};
	return GetConfig;
});