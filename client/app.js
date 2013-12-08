var express = require("express"),
	app = express(),
	server = require('http').createServer(app),
	i18next = require('i18next'),
	supportedLanguages = ['en-GB','sv-SE'],
	stylus = require('stylus'),
	nib = require('nib'),
	io = require('socket.io').listen(server);

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
	sendMissingTo: 'fallback',
	supportedLngs: supportedLanguages,
	fallbackLng: 'en'
});

app.configure(function() {
	app.use(express.logger({format:'dev'}));
	app.use(express.bodyParser());
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
	res.render('landing.jade');
});

app.get('/views/:view',function(req,res) {
	res.render(req.params.view + '.jade');
});

app.get('/js/Mojo.js',function(req,res) {
	res.sendfile('js/Mojo.js');
});

app.get('/js/vendor/:file',function(req,res) {
	res.sendfile('js/vendor/' + req.params.file)
});

server.listen(process.env.PORT || 80);
console.log("Express server started on port: " + (process.env.PORT || 80));