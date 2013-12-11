require.config({
	baseUrl: "js/MojoUI"
});

define("MojoUI/MojoUI",["Element","Window","Panel","Rectangle","Color"],function(Element,Window,Panel,Rectangle,Color) {
	var UI = function(w,h) {
		this.root_element = new Element({width:w,height:h,x:0,y:0});
		// only the root element should have an accessible draw function
		this.root_element.draw = function(ctx) {
			var self = this;
			ctx.save();
			if(this.background instanceof Color) {
				ctx.save();
				ctx.fillStyle = Color.canvasFillStyle();
				ctx.fillRect(this.position.x,this.position.y,this.position.width,this.position.height);
				ctx.restore();
			} else if(this.background instanceof Image) {
				ctx.drawImage(this.background,this.position.x,this.position.y);
			}
			ctx.restore();

			// draw children last of all
			this.children.forEach(function(child) {
				child._draw(ctx,self);
			});
		}
	};
	UI.prototype = {
		root_element: null,
		// alias root_element.draw to save a few characters of typing
		draw: function(ctx) {
			this.root_element.draw(ctx);
		}
	}
	UI.Element = Element;
	UI.Window = Window;
	UI.Panel = Panel;
	UI.Rectangle = Rectangle;
	return UI;
});