var config = require('./config.js'),
	World = require('mojo-world');

var WorldServer = function() {};

WorldServer.prototype = {
	uri: "",
	population: 0,
	active_population: 0,
	capacity: config.world.capacity,
	save: function() {}
}

WorldServer.createInstance = function(loginDB) {
	var world = new World(loginDB);
	world.init();
	return world.dbObject; // return something the caller will have use for
}

module.exports = WorldServer;