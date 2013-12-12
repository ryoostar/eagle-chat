/**
 * Module dependencies.
 */
var express = require('express'), app = express(), http = require('http'), routes = require('./routes');
var UserDao = require('./eagle_modules/dao/userDao'), GroupDao = require('./eagle_modules/dao/groupDao');
var UserService = require('./eagle_modules/service/userService');
var UserModel = require('./eagle_modules/model/UserModel');
var server = http.createServer(app), path = require('path');

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
    var character = req.body.character;
    if (nickName && nickName.trim() !== '') {
	UserDao.hasUser(nickName, function(hasUser) {
	    if (hasUser === false) {
		UserDao.addUser(nickName,character);
	    }
	    req.session.nickName = nickName;
	    isSuccess = true;
	    
	    GroupDao.getRoomList(function(groupList) {
		res.render('enter', {
		    isSuccess : isSuccess,
		    nickName : nickName,
		    groupList : groupList,
		    character : character
		});
	    });
	    
	});
    }
});

/**
 * 그룹으로 들어가기
 */
app.get('/enter', function(req, res) {
    UserService.enterGroup(req, res);
});

/**
 * 그룹만들기
 */
app.post('/makeGroup', function(req, res) {
    var groupName = req.body.groupName;
    var character = req.body.character;
    if (groupName && groupName.trim() !== '') {
	GroupDao.hasGroup(groupName, function(hasGroup) {
	    var isSuccess = false;
	    if (hasGroup == false) {
		isSuccess = true;
		GroupDao.addRoom(groupName,function(){
		    res.render('makeGroup', {
			isSuccess : isSuccess,
			groupName : groupName,
			character : character,
		    });    
		});
	    } else {
		isSuccess = false;
	    }
	});
    } else {
	res.render('makeGroup', {
	    isSuccess : false,
	    groupName : groupName,
	    character : character
	});
    }
});

/**
 * 그룹선택하여 참여하기
 */
app.get('/join/:id/:character', function(req, res) {
    var isSuccess = false, groupName = req.params.id,character = req.params.character;
    console.log(req.params);
    GroupDao.hasGroup(groupName, function(hasGroup) {
	if (hasGroup == true) {
	    UserDao.getUsers(groupName, function(attendants) {
		res.render('group', {
		    isSuccess : true,
		    groupName : groupName,
		    nickName : req.session.nickName,
		    users : attendants,
		    character : character
		});
	    });
	}
    });
});

server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

// require('./room')(server);
require('./eagle_modules/service/talkService')(server);
