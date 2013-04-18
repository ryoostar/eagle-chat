/**
 * Module dependencies.
 */
var express = require('express'), app = express(), http = require('http'), routes = require('./routes'), Chat = require('./dbchat'), server = http.createServer(app), path = require('path'), mongojs = require('mongojs');

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

/**
 * NickName입력후 그룹선택 화면으로 이동
 */
app.post('/enter', function(req, res) {
    var isSuccess = false, nickName = req.body.nickName;

    if (nickName && nickName.trim() !== '') {
	Chat.hasUser(nickName, function(hasUser) {
	    if (hasUser === false) {
		Chat.addUser(nickName);
	    }
	    req.session.nickName = nickName;
	    isSuccess = true;
	});
    }
    Chat.getRoomList(function(roomList) {
	res.render('enter', {
	    isSuccess : isSuccess,
	    nickName : nickName,
	    roomList : roomList
	});
    });
});

/**
 * 그룹으로 들어가기
 */
app.get('/enter', function(req, res) {
    Chat.getRoomList(function(roomlist) {
	if (req.session.nickName) {
	    res.render('enter', {
		isSuccess : true,
		nickName : req.session.nickName,
		roomList : roomlist
	    });
	} else {
	    res.render('enter', {
		isSuccess : false,
		nickName : ''
	    });
	}
    });
});

/**
 * 그룹만들기
 */
app.post('/makeRoom', function(req, res) {
    var roomName = req.body.roomname;
    if (roomName && roomName.trim() !== '') {
	Chat.hasRoom(roomName, function(hasGroup) {
	    var isSuccess = false;
	    if (hasGroup == false) {
		Chat.addRoom(roomName);
		isSuccess = true;
	    } else {
		isSuccess = false;
	    }
	    res.render('makeRoom', {
		isSuccess : isSuccess,
		roomName : roomName
	    });
	});
    } else {
	res.render('makeRoom', {
	    isSuccess : false,
	    roomName : roomName
	});
    }
});

/**
 * 그룹선택하여 참여하기
 */
app.get('/join/:id', function(req, res) {
    var isSuccess = false, groupName = req.params.id;
    Chat.hasRoom(groupName, function(hasRoom) {
	if (hasRoom == true) {
	    Chat.getUsers(groupName, function(attendants) {
		res.render('room', {
		    isSuccess : true,
		    roomName : groupName,
		    nickName : req.session.nickName,
		    users : attendants
		});
	    });
	}
    });
});

server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

require('./room')(server);
