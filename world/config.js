var worldFirstHalves = [
	"dragon",
	"dungeon",
	"devil",
	"daemon",
	"miranda"
];

var worldSecondHalves = [
	"land",
	"realm",
	"world",
	"country",
	"castle"
];

function generateWorldName() {
	return 	worldFirstHalves[Math.floor(Math.random() * worldFirstHalves.length)] +
			worldSecondHalves[Math.floor(Math.random() * worldSecondHalves.length)];
}

var my_name = generateWorldName();

module.exports = {
	capacity: 500,
	mongoose: {
		connect_string: "mongodb://localhost/world-" + my_name
	},
	name: my_name,
	host: "localhost",
	generatePort: function() {
		// naïve generation function to be replaced with a better one later on
		return 65535 - Math.floor(Math.random() * 1000);
	},
	redis: {
		host: "localhost",
		port: 6379,
		pass: "redispassword",
		db: 2
	}
}