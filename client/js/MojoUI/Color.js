define("Color",[],function() {
	var Color = function(r,g,b,a) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a || 255;
	};
	Color.prototype = {
		r: 0,
		g: 0,
		b: 0,
		a: 0,
		canvasFillStyle: function() {
			return "rgba(" + r + "," + g + "," + b + "," + a + ")";
		}
	};
	Color.RED = new Color(255,0,0);
	Color.GREEN = new Color(0,255,0);
	Color.BLUE = new Color(0,0,255);
	return Color;
});