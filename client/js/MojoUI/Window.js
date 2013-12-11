define("Window",["Panel","Layout","Style"],function(Panel,Layout,Style) {
	var Window = function() {};
	Window.prototype = new Panel();
	Window.prototype.title = "";
	Window.prototype._draw = function(ctx,parent) {
		// draw title bar
		ctx.save();
		ctx.fillStyle = Style.TITLE_BAR_BACKGROUND;
		ctx.fillRect(
			parent.position.x + this.position.x,
			parent.position.y + this.position.y,
			this.position.width,
			Style.TITLE_BAR_THICKNESS
		);
		ctx.restore();
	}
	return Window;
});