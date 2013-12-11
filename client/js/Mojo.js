define("BugReport", ["jQuery"], function($) {
  var BugReport = function() {
  };
  BugReport.prototype = {errorType:"", recentActions:[], clientVersion:"", issueTitle:"", sendReport:function() {
    $.post("http://api.github.com/repos/cjbrowne/" + project_name + "/issues", {title:"User-generated report from " + (user_name || guest) + ": " + this.issueTitle, body:"Received error: " + this.errorType + "Recent actions: " + JSON.stringify(this.recentActions) + "\nClient Version: " + clientVersion});
  }};
  return BugReport;
});
define("GetConfig", [], function() {
  var GetConfig = function() {
  };
  GetConfig.prototype = {login:null, world:null, ready:false, retrieve:function(which) {
    var self = this;
    $.get("/client_config/" + which, function(response) {
      if (self.indexOf(which) != -1) {
        (self[which] = response) && (self.ready = true);
      } else {
        throw new Error("Server did not respond with config for " + which);
      }
    });
  }, retrieveAll:function(cb) {
    var self = this;
    $.get("/client_config/", function(response) {
      self.login = response.login;
      self.world = response.world;
      cb(self);
    });
  }};
  return GetConfig;
});
define("LoginClient", [], function() {
  var LoginClient = function(config) {
    this.config = config;
  };
  LoginClient.prototype = {socket:null, config:null, connected:false, connect:function() {
    this.socket = io.connect("http://" + this.config.host + ":" + this.config.port);
    this.connected = true;
  }, getWorldList:function(cb) {
    console.log("requesting world list from server...");
    this.socket.emit("worlds");
    this.socket.on("worlds", function(data) {
      cb(data);
    });
  }};
  return LoginClient;
});
define("Renderer", ["MojoUI/MojoUI"], function(MojoUI) {
  function Renderer() {
  }
  Renderer.prototype = {three:{renderer:null}, $hudCanvas:null, hudctx:null, $worldCanvas:null, hud_offscreen:{canvas:null, ctx:null, redraw:false}, ui:null, ready:false, init:function(ready) {
    var self = this;
    $.get("/views/game", function(response) {
      $("#content").html(response);
      self.$hudCanvas = $("#hud");
      self.$worldCanvas = $("#world");
      self.hudctx = self.$hudCanvas[0].getContext("2d");
      self.hud_offscreen.canvas = document.createElement("canvas");
      self.hud_offscreen.ctx = self.hud_offscreen.canvas.getContext("2d");
      try {
        self.three.renderer = new THREE.WebGLRenderer;
      } catch (e) {
        console.log("Could not init webgl renderer, falling back to slower canvas-based renderer");
        self.three.renderer = new THREE.CanvasRenderer;
      } finally {
        self.three.renderer.setSize(self.$worldCanvas.width(), self.$worldCanvas.height());
        self.$worldCanvas.append(self.three.renderer.domElement);
      }
      self.ui = new MojoUI(self.$worldCanvas.width(), self.$worldCanvas.height());
      self._draw();
      ready.apply(self);
    });
  }, drawWorldList:function(worldList) {
    var worldListWindow = new MojoUI.Window;
    this.ui.root_element.addChild(worldListWindow);
    this.ui.draw(this.hud_offscreen.ctx);
    this.hud_offscreen.redraw = true;
  }, _draw:function() {
    var self = this;
    if (this.three.renderer == null || this.hudctx == null) {
      throw new Error("draw function called before init");
    }
    requestAnimationFrame(function() {
      self._draw.apply(self);
    });
    if (this.hud_offscreen.redraw) {
      this.hudctx.drawImage(this.hud_offscreen.canvas, 0, 0);
      this.hud_offscreen.redraw = false;
    }
  }};
  return Renderer;
});
require(["LoginClient", "GetConfig", "Renderer"], function(LoginClient, GetConfig, Renderer) {
  var conf = new GetConfig;
  var login;
  conf.retrieveAll(function(c) {
    login = new LoginClient(c.login);
    login.connect();
  });
  function update_login_status() {
    $.get("/me/", function(response) {
      if (response.email) {
        $("#login").hide();
        $("#infobox").show();
        $("#username").html(response.email);
        var sub_color;
        switch(response.subscription_status) {
          case "frozen":
            sub_color = "#CCF";
            break;
          case "trial":
            sub_color = "#CFC";
            break;
          case "full":
            sub_color = "#FCC";
            break;
          default:
            sub_color = "#F00";
            break;
        }
        $("#subscriptionStatus").html(response.subscription_status_translated).css({color:sub_color});
        $("#enterGame").show();
      } else {
        $("#login").show();
        $("#infobox").hide();
        $("#enterGame").hide();
      }
    });
  }
  update_login_status();
  $("#languageChooser").on("change", function(evt) {
    window.location.search = "setLng=" + $(this).val();
  });
  $("#registerButton").on("click", function(evt) {
    $.post("/register/", {email:$("#loginUsername").val(), password:$("#loginPassword").val()}, function(response) {
      $("#content").html(response);
    });
  });
  $("#verifyPasswordSubmit").on("click", function(evt) {
    $.post("/login/", {email:$("#verifiedEmail").text(), password:$("#verifyPasswordInput").val(), verifying:true}, function(response) {
      update_login_status();
      $("#content").html(response);
    });
  });
  $("#loginSubmit").on("click", function(evt) {
    $.post("/login/", {email:$("#loginUsername").val(), password:$("#loginPassword").val()}, function(response) {
      update_login_status();
      $("#content").html(response);
      setTimeout(function() {
        $("#message").fadeOut("slow");
      }, 2E3);
    });
  });
  $("#enterGame").on("click", function(evt) {
    var renderer = new Renderer;
    renderer.init(function() {
      if (login.connected) {
        login.getWorldList(function(worldList) {
          renderer.drawWorldList(worldList);
        });
        $("#enterGame").hide();
      } else {
      }
    });
  });
});

