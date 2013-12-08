require([""],function() {
	$("#languageChooser").on('change',function(evt) {
		window.location.search = "setLng=" + $(this).val();
	});
	$("#registerButton").on('click',function(evt) {
		$.post('/register/',{
			email: $("#loginUsername").val(),
			password: $("#loginPassword").val()
		},function(response) {
			$("#content").html(response);
		});
	});
});