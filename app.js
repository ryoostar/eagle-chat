/**
 * Module dependencies.
 */
var express = require('express'), app = express(), http = require('http'), routes = require('./routes'), assert = require('assert');
var server = http.createServer(app), path = require('path');

/**
 * Configuration
 */
app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
	secret : 'secret key',
	maxAge : 3600000
    }));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});


/**
 * URL Mapping
 * routes/index.js
 */
app.get('/', routes.index);

// 그룹으로 들어가기
app.post('/enter', routes.enter);
app.get('/enter', routes.enter);

app.get('/logout', routes.logout);

// 그룹으로 들어가기
//app.get('/enter', routes.entergroup);

// 그룹만들기
app.post('/makegroup', routes.makegroup);

// 그룹선택하여 참여하기
app.get('/join/:id/:character', routes.join);

server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

require('./eagle_modules/service/talkService')(server);
