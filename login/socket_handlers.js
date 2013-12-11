module.exports = function(loginDB,WorldServer) {
	return {
		worlds: function() {
			console.log("socket handler called");
			var socket = this;
			loginDB.World.find({},function(err,worlds) {
				console.log("mongoose contacted...");
				if(err) {
					console.log("mongoose error: " + err);
				} else if(!worlds) {
					console.log("world list not backed by database");
				} else {
					var worldList = {};
					var available_worlds = 0;
					worlds.forEach(function(world) {
						if(world.population < world.capacity) {
							available_worlds++;
						}
						worldList[world.uri] = {
							pop: world.population,
							active_pop: world.active_players,
							capacity: world.capacity
						};
					});
					if(available_worlds == 0) {
						// spin up new worldserver instance
						var world = WorldServer.createInstance(loginDB);
						worldList[world.uri] = {
							pop: world.population,
							active_pop: world.active_players,
							capacity: world.capacity
						};
					}
					socket.emit('worlds',worldList);
				}
			});
		}
	}
}