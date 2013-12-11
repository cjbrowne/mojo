module.exports = function(loginDB) {
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
					worlds.forEach(function(world) {
						worldList[world.uri] = {
							pop: world.population,
							active_pop: world.active_players,
							capacity: world.capacity
						};
					});
					socket.emit('worlds',worldList);
				}
			});
		}
	}
}