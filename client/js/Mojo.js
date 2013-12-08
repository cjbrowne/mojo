define("BugReport", ["jQuery"], function(b) {
  var a = function() {
  };
  a.prototype = {errorType:"", recentActions:[], clientVersion:"", issueTitle:"", sendReport:function() {
    b.post("http://api.github.com/repos/cjbrowne/" + project_name + "/issues", {title:"User-generated report from " + (user_name || guest) + ": " + this.issueTitle, body:"Received error: " + this.errorType + "Recent actions: " + JSON.stringify(this.recentActions) + "\nClient Version: " + clientVersion});
  }};
  return a;
});
require([""], function() {
  $("#languageChooser").on("change", function(b) {
    window.location.search = "setLng=" + $(this).val();
  });
  $("#registerButton").on("click", function(b) {
    $.post("/register/", {email:$("#loginUsername").val(), password:$("#loginPassword").val()}, function(a) {
      $("#content").html(a);
    });
  });
});

