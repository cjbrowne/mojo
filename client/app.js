var express = require("express"),
	app = express(),
	server = require('http').createServer(app),
	i18next = require('i18next'),
	supportedLanguages = ['en','sv'],
	stylus = require('stylus'),
	nib = require('nib'),
	io = require('socket.io').listen(server),
	mongoose = require('mongoose'),
	loginDB = require('../common/LoginDB.js')(mongoose),
	crypto = require('crypto'),
	mailer = require('nodemailer'),
	config = require('./config.js'),
	merge = require('merge'),
	RedisStore = require("connect-redis")(express);

// compile the client-side library when the server starts (simplifies development)
require('./compile.js')();

// TODO: external server for production
var smtp = mailer.createTransport("Sendmail","/usr/sbin/sendmail");

mongoose.connect("mongodb://localhost/loginDB");

function compile(str,path) {
	return stylus(str)
		.set('filename',path)
		.set('compress',true)
		.use(nib())
		.import('nib')
		;
}

i18next.init({
	ns: {
		namespaces: ['common'],
		defaultNs: 'common'
	},
	resSetPath: 'locales/__lng__/__ns__.json',
	saveMissing: true,
	debug:true,
	sendMissingTo: 'all',
	supportedLngs: supportedLanguages,
	fallbackLng: false
});

app.configure(function() {
	app.set("view engine","jade");
	app.use(express.logger({format:'dev'}));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: config.session_secret,
		store: new RedisStore({
			host: 'localhost',
			port: 6379,
			db: 2,
			pass: config.redis.password
		}),
		key: "express.sid"
	}));
	app.use(i18next.handle);
	app.use(stylus.middleware({
		src:__dirname,
		dest:__dirname,
		debug:true,
		force:true,
		compile:compile
	}));
	app.use(app.router);
	app.use('/css',express.static(__dirname + '/css'));
	app.use('/img',express.static(__dirname + '/img'));
});

app.locals = {
	supportedLanguages: supportedLanguages
}

i18next.registerAppHelper(app);

app.get('/',function(req,res) {
	res.render('landing.jade',{user:req.session.user});
});

app.get('/views/:view',function(req,res) {
	res.render(req.params.view + '.jade');
});

app.get('/test/email_error',function(req,res) {
	res.render('error',{title:"error.email_taken_title",body:"error.email_taken_body"});
})

app.get('/js/Mojo.js',function(req,res) {
	res.sendfile('js/Mojo.js');
});

app.get('/js/vendor/:file',function(req,res) {
	res.sendfile('js/vendor/' + req.params.file)
});

app.get('/js/MojoUI/:file',function(req,res) {
	res.sendfile('js/MojoUI/' + req.params.file);
})

function create_email_token() {
	var r = crypto.randomBytes(48);
	return r.toString('base64').replace(/\//g,'_').replace(/\+/g,'-');
}

function create_password_hash(pass) {
	var hash = crypto.createHash('sha256');
	hash.update(pass);
	return hash.digest('hex');
}

// helper API to let the client request specific error messages
app.get('/error/:title/:body',function(req,res) {
	res.render("error",{title:req.params.title,body:req.params.body});
})

app.get('/verify/:token',function(req,res) {
	loginDB.User.findOne({'token':req.params.token},function(err,user) {
		if(err) {
			console.log("Mongoose error: " + err);
			res.render("verification",{error: {title: "error.verify.mongoose_error.title",body:"error.verify.mongoose_error.body"}});
		} else if(!user) {
			res.render("verification",{error: {title: "error.verify.user_not_found.title",body:"error.verify.user_not_found.body"}});
		} else {
			if(user.verified) {
				res.render("verification",{error: {title: "error.verify.already_verified.title",body:"error.verify.already_verified.body"}});
			} else {
				res.render("verification",{user: user.email});
			}
		}
	});
});

// api to get information about the currently logged-in user
app.get('/me/:property',function(req,res) {
	var response_object = {};
	if(req.session.user && req.session.user[req.params.property])
		response_object[req.params.property] = req.session.user[req.params.property];
	else
		response_object[req.params.property] = false;
	console.log(JSON.stringify(response_object));
	res.json(response_object);
});

// shortcut to get all available user information
// TODO: error handling
app.get('/me',function(req,res) {
	if(req.session.email) {
		loginDB.User.findOne({email: req.session.email},function(err,usr) {
			loginDB.Billing.findOne({userId:usr._id},function(err,bil) {
				// TODO: create global "sanitization" functions for User and Billing objects
				res.json(merge({
					email: usr.email
				},{
					subscription_status_translated: i18next.t("subscription." + bil.subscription_status),
					subscription_status: bil.subscription_status
				}));
			});
		});
	} else {
		// return an empty object
		res.json({});
	}
});

// get subscription information
app.get('/sub/:field',function(req,res) {
	loginDB.Billing.findById();
});

app.post('/login',function(req,res) {
	if(!req.body.email || !req.body.password) {
		res.render("error",{title:"error.login.missing_email_or_password.title",body:"error.login.missing_email_or_password.body"});
	} else {
		loginDB.User.findOne({email: req.body.email},function(err,user) {
			if(err) {
				console.log("Mongoose error: " + err);
				res.render("error",{title:"error.mongoose_error.title",body:"error.mongoose_error.body"});
			} else if (!user || user.hash != create_password_hash(req.body.password)) {
				res.render("error",{title:"error.login.bad_user_or_password.title",body:"error.login.bad_user_or_password.body"});
			} else {
				if(req.body.verifying) {
					user.verified = true;
					user.save();
				}
				// just save the email associated with this session
				req.session.email = user.email;
				console.log(JSON.stringify(user));
				res.render("message",{title:"login.success.title",body:"login.success.body"});
			}
		});
	}
});

app.get('/logout',function(req,res) {
	// nuking the session will log the user out
	req.session.destroy();
	// redirect back to the landing page afterwards
	// TODO: copy across ?setLng query
	res.redirect('/');
});

app.post('/register',function(req,res) {
	if(!req.body.email || !req.body.password) {
		res.render("error",{title:"error.register.missing_email_or_password.title",body:"error.register.missing_email_or_password.body"});
	} else {
		console.log("POST data found");
		loginDB.User.findOne({'email': req.body.email},function(err,person) {
			console.log("Searching for user in mongo database...");
			if(err) {
				console.log("mongoose error: " + err);
				res.render("error",{title:"error.mongoose_error.title",body:"error.mongoose_error.body"});
			} else if(person) {
				console.log("duplicate user");
				res.render("error",{title:"error.register.email_taken.title",body:"error.register.email_taken.body"});
			} else {
				console.log("no duplicate user found");
				var email_token = create_email_token();
				var u = new loginDB.User({
					email: req.body.email,
					verified: false,
					token: email_token,
					hash: create_password_hash(req.body.password)
				});
				res.render("email",{
					token: email_token,
					host: config.hostname,
					port: config.port
				},function(err,html) {
					console.log("email rendered");
					if(err) {
						console.log("Jade error: " + err);
						res.render("error",{title:"error.register.compose_email_failed.title",body:"error.register.compose_email_failed.body"});
					} else if(!html) {
						res.render("error",{title:"error.register.compose_email_failed.title",body:"error.register.compose_email_failed.body"})
					} else {
						smtp.sendMail({
							from: "Mojo Registration <" + config.email.register_address + ">",
							to: req.body.email,
							subject: "Mojo registration process email confirmation",
							html: html
						},function(error, response) {
							console.log("mail sent");
							if(error || !response) {
								res.render("error",{title:"error.register.unable_to_send_email.title",body:"error.register.unable_to_send_email.body"})
							} else {
								// ready to save the user object we created earlier
								u.save(function(err,user) {
									// TODO: handle errors
									var billingInfo = new loginDB.Billing({
										userId: user._id,
										subscription_status:"frozen"
									});
									billingInfo.save();
								});
								res.render("message",{title:"registration.welcome.title",body:"registration.welcome.body"});
							}
						});
					}
				});
			}
		});
	}
});

// API for getting client-side config dynamically
app.get('/client_config',function(req,res) {
	res.json(config.client);
});

// pretty raw because I can handle errors on the client end and there's nothing a hacker can get from this
app.get('/client_config/:area',function(req,res) {
	res.json(config.client[area]);
});

server.listen(config.port);
console.log("Express server started on port: " + (process.env.PORT || 80));