var sio = require('socket.io'),
	mongoose = require('mongoose'),
	redis = require('redis'),
	config = require('./config.js'),
	redis_client = redis.createClient(
		config.redis.port,
		config.redis.host,
		{
			auth_pass:config.redis.pass
		}
	),
	worldDB = require('./db/main.js')(mongoose),
	my_port = config.generatePort();

mongoose.connect(config.mongoose.connect_string);

var World = function(loginDB) {
	this.dbObject = new loginDB.World({
		uri: config.host + ":" + my_port + "/world-" + config.name,
		capacity: config.capacity,
		active_players: 0,
		population: 0
	});
	this.dbObject.save();
}

World.prototype = {
	dbObject: null,
	init: function() {
		var io = sio.listen(my_port);
		io.configure(function() {
			io.set('authorization',function(handshakeData,callback) {
				// TODO: authenticate player and associate playerId with socket
			});
		});

		// namespaced to allow the world server to live at the same address as a login server if necessary
		io.of('/world').on('connection',function(socket) {
			socket.on('spawn',function(data) {
				worldDB.Character.findOne({id:data.characterId},function(err,character) {
					if(err) {
						socket.emit('error',{message:err});
					} else if(!character) {
						socket.emit('error',{message: "Character not found."});
					} else {
						worldDB.Player.findOne({id:socket.handshake.playerId},function(err,player) {
							if(err) {
								socket.emit('error',{message:err});
							} else if(!player) {
								socket.emit('error',{message:"Authenticated with invalid player id.",bugReport:true});
							} else if(player.characters.indexOf(data.characterId) == -1) {
								socket.emit('error',{message:"You don't own the character you selected.",cheatWarn: true});
							}
						});
					}
				});
			});
		});
	}
}

module.exports = World;