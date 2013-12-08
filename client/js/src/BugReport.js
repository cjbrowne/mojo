define("BugReport",["jQuery"],function($) {
	var BugReport = function () {};
	BugReport.prototype = {
		errorType: "",
		recentActions: [],
		clientVersion: "",
		issueTitle: "",
		sendReport: function() {
			$.post(
				"http://api.github.com/repos/cjbrowne/" + project_name + "/issues",
				{
					title: "User-generated report from " + (user_name || guest) + ": " + this.issueTitle,
					body: "Received error: " +  this.errorType + "Recent actions: " + JSON.stringify(this.recentActions) + "\nClient Version: " + clientVersion
				}
			)
		}
	}
	return BugReport;
});