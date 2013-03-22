/**
 * Module dependencies.
 */
var express = require('express'), 
	routes = require('./routes'), 
	user = require('./routes/user'), 
	app = express(), 
	http = require('http'), 
	Chat = require('./chat'), 
	server = http.createServer(app), 
	path = require('path');

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	// 주의 !!! 쿠키 및 세션은 app.router설정 전에 할것 .
	app.use(express.cookieParser());
	app.use(express.session({
		secret : 'secret key'
	}));
	app.use(app.router);

	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

/**
 * enter action 에 대한 처리
 */
app.post('/enter', function(req, res) {
	console.log(req.body);
	var isSuccess = false, nickName = req.body.nickName;
	if (nickName && nickName.trim() !== '') {
		if (!Chat.hasUser(nickName)) {
			console.log('nickName is : ' + nickName);
			Chat.addUser(nickName);
			req.session.nickName = nickName;
			isSuccess = true;
		}
	}

	res.render('enter', {// enter.jade 로 이동한다.
		isSuccess : isSuccess, // jade 파일에서 사용할 변수 설정
		nickName : nickName,
		roomList : Chat.getRoomList()
	});
});

app.get('/enter', function(req, res) {
	if (req.session.nickName) {
		res.render('enter', {
			isSuccess : true,
			nickName : req.session.nickName,
			roomList : Chat.getRoomList()
		});
	} else {
		res.render('enter', {
			isSuccess : false,
			nickName : ''
		});
	}
});

app.post('/makeRoom', function(req, res) {
	var isSuccess = false, roomName = req.body.roomname;
	if (roomName && roomName.trim() !== '') {
		if (!Chat.hasRoom(roomName)) {
			Chat.addRoom(roomName);
			isSuccess = true;
		}
	}

	res.render('makeRoom', {
		isSuccess : isSuccess,
		roomName : roomName
	});
});

app.get('/join/:id', function(req, res) {
	var isSuccess = false, roomName = req.params.id;
	if (Chat.hasRoom(roomName)) {
		isSuccess = true;
	}

	console.log('room.jade로 전송 -  roomName : ' + roomName + 'nickName :' + req.session.nickName);

	res.render('room', {
		isSuccess : isSuccess,
		roomName : roomName,
		nickName : req.session.nickName
	});

});

server.listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});

require('./room')(server);

