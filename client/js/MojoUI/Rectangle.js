define("Rectangle",[],function() {
	var Rectangle = function(dim) {
		if(dim) {
			this.width = dim.width || 0;
			this.height = dim.height || 0;
			this.x = dim.x || 0;
			this.y = dim.y || 0;
		}
	};
	Rectangle.prototype = {
		width: 0,
		height: 0,
		x: 0,
		y: 0
	};
	return Rectangle;
});