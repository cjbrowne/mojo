define("BugReport", ["jQuery"], function(a) {
  var b = function() {
  };
  b.prototype = {errorType:"", recentActions:[], clientVersion:"", issueTitle:"", sendReport:function() {
    a.post("http://api.github.com/repos/cjbrowne/" + project_name + "/issues", {title:"User-generated report from " + (user_name || guest) + ": " + this.issueTitle, body:"Received error: " + this.errorType + "Recent actions: " + JSON.stringify(this.recentActions) + "\nClient Version: " + clientVersion});
  }};
  return b;
});
define("GetConfig", [], function() {
  var a = function() {
  };
  a.prototype = {login:null, world:null, ready:!1, retrieve:function(b) {
    var a = this;
    $.get("/client_config/" + b, function(c) {
      if (-1 != a.indexOf(b)) {
        (a[b] = c) && (a.ready = !0);
      } else {
        throw Error("Server did not respond with config for " + b);
      }
    });
  }, retrieveAll:function(a) {
    var d = this;
    $.get("/client_config/", function(c) {
      d.login = c.login;
      d.world = c.world;
      a(d);
    });
  }};
  return a;
});
define("LoginClient", [], function() {
  var a = function(a) {
    this.config = a;
  };
  a.prototype = {socket:null, config:null, connected:!1, connect:function() {
    this.socket = io.connect("http://" + this.config.host + ":" + this.config.port);
    this.connected = !0;
  }, getWorldList:function(a) {
    console.log("requesting world list from server...");
    this.socket.emit("worlds");
    this.socket.on("worlds", function(d) {
      a(d);
    });
  }};
  return a;
});
define("Renderer", [], function() {
  function a() {
  }
  a.prototype = {init:function() {
  }, drawWorldList:function(a) {
  }};
  return a;
});
require(["LoginClient", "GetConfig", "Renderer"], function(a, b, d) {
  function c() {
    $.get("/me/", function(a) {
      if (a.email) {
        $("#login").hide();
        $("#infobox").show();
        $("#username").html(a.email);
        var e;
        switch(a.subscription_status) {
          case "frozen":
            e = "#CCF";
            break;
          case "trial":
            e = "#CFC";
            break;
          case "full":
            e = "#FCC";
            break;
          default:
            e = "#F00";
        }
        $("#subscriptionStatus").html(a.subscription_status_translated).css({color:e});
      } else {
        $("#login").show(), $("#infobox").hide();
      }
    });
  }
  var f;
  (new b).retrieveAll(function(b) {
    f = new a(b.login);
    f.connect();
  });
  c();
  $("#languageChooser").on("change", function(a) {
    window.location.search = "setLng=" + $(this).val();
  });
  $("#registerButton").on("click", function(a) {
    $.post("/register/", {email:$("#loginUsername").val(), password:$("#loginPassword").val()}, function(a) {
      $("#content").html(a);
    });
  });
  $("#verifyPasswordSubmit").on("click", function(a) {
    $.post("/login/", {email:$("#verifiedEmail").text(), password:$("#verifyPasswordInput").val(), verifying:!0}, function(a) {
      c();
      $("#content").html(a);
    });
  });
  $("#loginSubmit").on("click", function(a) {
    $.post("/login/", {email:$("#loginUsername").val(), password:$("#loginPassword").val()}, function(a) {
      c();
      $("#content").html(a);
      setTimeout(function() {
        $("#message").fadeOut("slow");
      }, 2E3);
    });
  });
  $("#enterGame").on("click", function(a) {
    var b = new d;
    b.init();
    f.connected && f.getWorldList(function(a) {
      console.log(a);
      b.drawWorldList(a);
    });
  });
});

