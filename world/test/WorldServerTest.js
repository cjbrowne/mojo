var should = require("should"),
	io = require("socket.io-client");

var options = {
	transports: ['websocket'],
	'force new connection': true
};