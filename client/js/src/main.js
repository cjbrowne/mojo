require(["LoginClient","GetConfig","Renderer"],function(LoginClient,GetConfig,Renderer) {
	var conf = new GetConfig();
	var login;
	// config retrieval is async
	conf.retrieveAll(function(c) {
		login = new LoginClient(c.login);
		login.connect();
	});
	function update_login_status() {
		$.get("/me/",function(response) {
			if(response.email) {
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
				$("#subscriptionStatus").html(response.subscription_status_translated).css({
					color:sub_color
				});
				$("#enterGame").show();
			} else {
				$("#login").show();
				$("#infobox").hide();
				$("#enterGame").hide();
			}
		});
	}
	update_login_status();
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
	$("#verifyPasswordSubmit").on('click',function(evt) {
		$.post("/login/",{
			email: $("#verifiedEmail").text(),
			password: $("#verifyPasswordInput").val(),
			verifying: true
		},function(response) {
			// if the password was correct, we should've been logged in
			update_login_status();
			$("#content").html(response);
		})
	});
	$("#loginSubmit").on('click',function(evt) {
		$.post("/login/",{
			email: $("#loginUsername").val(),
			password: $("#loginPassword").val()
		},function(response) {
			update_login_status();
			$("#content").html(response);
			setTimeout(function() {
				$("#message").fadeOut('slow');
			},2000);
		});
	});
	$("#enterGame").on('click',function(evt) {
		var renderer = new Renderer();
		renderer.init(function() {
			if(login.connected) {
				login.getWorldList(function(worldList) {
					renderer.drawWorldList(worldList);
				});
				$("#enterGame").hide(); // otherwise the user might click it again, leading to buggy behaviour
			} else {
				// TODO: inform user of error, suggest that it's probably temporary and attempt to reconnect to login server
			}
		});
	});
});