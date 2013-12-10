module.exports = function() {
	var ClosureCompiler = require("closurecompiler"),
		fs = require('fs');

	ClosureCompiler.compile(
		fs.readdirSync('js/src').map(function(filename) { return "js/src/" + filename; }),
		{
			compilation_level: "SIMPLE_OPTIMIZATIONS",
			formatting: "PRETTY_PRINT"
		},
		function(error,result) {
			if(result) {
				fs.writeFile("js/Mojo.js",result,function(err) {
					if(err) {
						console.log("FileSystem Error: " + err);
					} else {
						console.log("Compilation successful, js/Mojo.js written!");
					}
				});
			} else {
				console.log("ClosureCompiler Error: " + error);
			}
		}
	);
}