var io = require('socket.io').listen("5000"),
	mongoose = require('mongoose'),
	redis = require('redis'),
	redis_client = redis.createClient(),
	worldDB = require('db/main.js')(mongoose);

io.configure(function() {
	io.set('authorization',function(handshakeData,callback) {
		redis_client.get(handshakeData.headers.cookies.sessionId,function(err,reply) {
			if(err) {
				return callback(err);
			} else if(!reply) {
				return callback(null,false);
			} else {
				handshakeData.playerId = reply;
				return callback(null,true);
			}
		});
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