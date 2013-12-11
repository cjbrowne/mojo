var config = require('./config.js'),
	io = require('socket.io'),
	redis = require('redis'),
	redis_client = redis.createClient(
		config.redis.port,
		config.redis.host,
		{
			auth_pass:config.redis.pass
		}
	),
	mongoose = require('mongoose'),
	loginDB = require('../common/LoginDB.js')(mongoose),
	//Cookies = require('cookies'),
	handlers = require('./socket_handlers.js')(loginDB,require('./WorldServer.js'));
mongoose.connect(config.mongoose.connect_string);

// allows us to keep this in sync with the client's redis store
redis_client.select(config.redis.db);

redis_client.on("error",function(err) {
	console.log("Error: " + err);
});

var sio = io.listen(config.port);

sio.set('authorization',function(data,accept) {
	// TODO: authenticate client using Redis and data.headers.cookie
	accept(null,true);
});

sio.sockets.on('connection',function(socket) {
	for(var message in handlers) {
		socket.on(message,function() { handlers[message].apply(socket,arguments); });
	}
});