define("BugReport", ["jQuery"], function(b) {
  var a = function() {
  };
  a.prototype = {errorType:"", recentActions:[], clientVersion:"", issueTitle:"", sendReport:function() {
    b.post("http://api.github.com/repos/cjbrowne/" + project_name + "/issues", {title:"User-generated report from " + (user_name || guest) + ": " + this.issueTitle, body:"Received error: " + this.errorType + "Recent actions: " + JSON.stringify(this.recentActions) + "\nClient Version: " + clientVersion});
  }};
  return a;
});
require([""], function() {
  function b() {
    $.get("/me/", function(a) {
      if (a.email) {
        $("#login").hide();
        $("#infobox").show();
        $("#username").html(a.email);
        var c;
        switch(a.subscription_status) {
          case "frozen":
            c = "#CCF";
            break;
          case "trial":
            c = "#CFC";
            break;
          case "full":
            c = "#FCC";
            break;
          default:
            c = "#F00";
        }
        $("#subscriptionStatus").html(a.subscription_status_translated).css({color:c});
      } else {
        $("#login").show(), $("#infobox").hide();
      }
    });
  }
  b();
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
      b();
      $("#content").html(a);
    });
  });
  $("#loginSubmit").on("click", function(a) {
    $.post("/login/", {email:$("#loginUsername").val(), password:$("#loginPassword").val()}, function(a) {
      b();
      $("#content").html(a);
      setTimeout(function() {
        $("#message").fadeOut("slow");
      }, 2E3);
    });
  });
});

