require([""],function() {
	$("#languageChooser").on('change',function(evt) {
		window.location.search = "setLng=" + $(this).val();
	});
	$("#registerButton").on('click',function(evt) {
		$.get('/views/register',function(data) {
			$("#content").html(data);
		});
	});
});