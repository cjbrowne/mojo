define("Renderer",["MojoUI/MojoUI"],function(MojoUI) {
	function Renderer() {};
	Renderer.prototype = {
		three: {
			renderer: null
		},
		$hudCanvas: null,
		hudctx: null,
		$worldCanvas: null,
		hud_offscreen: {
			canvas: null,
			ctx: null,
			redraw:false
		},
		ui: null,
		ready:false,
		init: function(ready) {
			var self = this;
			$.get("/views/game",function(response) {
				$("#content").html(response);
				self.$hudCanvas = $("#hud");
				self.$worldCanvas = $("#world");
				self.hudctx = self.$hudCanvas[0].getContext('2d');
				self.hud_offscreen.canvas = document.createElement('canvas');
				self.hud_offscreen.ctx = self.hud_offscreen.canvas.getContext('2d');
				try {
					self.three.renderer = new THREE.WebGLRenderer();
				} catch(e) {
					console.log("Could not init webgl renderer, falling back to slower canvas-based renderer");
					self.three.renderer = new THREE.CanvasRenderer();
				} finally {
					self.three.renderer.setSize(self.$worldCanvas.width(),self.$worldCanvas.height());
					self.$worldCanvas.append(self.three.renderer.domElement);
				}
				self.ui = new MojoUI(self.$worldCanvas.width(),self.$worldCanvas.height());
				// start animation loop automatically
				self._draw();
				ready.apply(self);
			});
		},
		drawWorldList: function(worldList) {
			var worldListWindow = new MojoUI.Window();
			this.ui.root_element.addChild(worldListWindow);
			this.ui.draw(this.hud_offscreen.ctx);
			this.hud_offscreen.redraw = true;
		},
		_draw: function() {
			var self = this;
			if(this.three.renderer == null || this.hudctx == null) {
				throw new Error("draw function called before init");
			}
			requestAnimationFrame(function() { self._draw.apply(self) });
			if(this.hud_offscreen.redraw) {
				this.hudctx.drawImage(this.hud_offscreen.canvas,0,0);
				this.hud_offscreen.redraw = false;
			}
		}
	}
	return Renderer;
});