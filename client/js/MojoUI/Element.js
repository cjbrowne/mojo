define("Element",["Rectangle"],function(Rectangle) {
	var Element = function(dim) {
		if(dim instanceof Rectangle) {
			this.position = dim;
		} else {
			this.position = new Rectangle(dim);
		}
	};
	Element.prototype = {
		children: [],
		redraw: false,
		shown: true,
		position: null,
		background: null,
		addChild: function(e) {
			if(!(e instanceof Element)) {
				throw new Error("Cannot add non-Element child to Element");
			}
			this.children.push(e);
			this.redraw = true;
		},
		_draw: function(ctx,parent) {
			var self = this;
			ctx.save();
			if(background instanceof Color) {
				ctx.fillStyle = Color.canvasFillStyle();
			} else if(background instanceof Image) {
				ctx.drawImage(background,parent.position.x + this.position.x,parent.position.y + this.position.y);
			}
			ctx.restore();

			// draw children last of all
			this.children.forEach(function(child) {
				child._draw(ctx,self);
			});
		}
	};
	return Element;
});