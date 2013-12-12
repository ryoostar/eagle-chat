module.exports = function(server) {
    console.log('===================✎ Entered TalkService');
    var GroupDao = require('../dao/groupDao'), TalkDao = require('../dao/talkDao');
    var io = require('socket.io').listen(server);

    io.configure(function() {
	io.enable('browser client etag');
	// io.set('log level', 3);
	io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling' ]);
    });

    io.of('/group').on('connection', function(socket) {
	var joinedGroup = null;
	socket.on('join', function(data) {
	    if (data && data.groupName) {
		joinedGroup = data.groupName;
		GroupDao.getGroup(joinedGroup, function(group) {
		    if (group) {
			var attendants = group.attendants, hasAlready = false;
			for ( var i = 0; i < attendants.length; i++) {
			    if (attendants[i].nickName == data.nickName)
				hasAlready = true;
			}
			if (!hasAlready) {
			    var user = {
				    nickName : data.nickName,
				    character : data.character
			    }
			    group.attendants.push(user);

			    GroupDao.updateGroupAttendants(group, function() {

			    });
			}
			socket.join(joinedGroup);
			TalkDao.getGroupTalks(joinedGroup,function(talks){
			    socket.emit('joined', {
				isSuccess : true,
				nickName : data.nickName,
				isNewMember : !hasAlready,
				character : data.character,
				talks : talks
			    });
			})
			socket.broadcast.to(joinedGroup).emit('joined', {
			    isSuccess : true,
			    nickName : data.nickName,
			    character : data.character,
			    isNewMember : !hasAlready
			});
		    }
		});
	    } else {
		socket.emit('joined', {
		    isSuccess : false
		});
	    }
	});

	socket.on('message', function(data) {
	    console.log("Send Message ===========================================");
	    console.log(data);
	    TalkDao.insertTalk(data, function() {
		console.log("Message insert completed===============================");
	    });

	    if (data.groupName) {
		socket.broadcast.to(data.groupName).json.send(data);
	    }
	    console.log("========================================================");
	});
    });
}