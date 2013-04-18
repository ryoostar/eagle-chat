module.exports = function(server) {
    console.log('room.js에 들어왔어');
    var io = require('socket.io').listen(server);
    var mongojs = require('mongojs');
    var db = mongojs('172.16.2.4:27017/eagleagle', [ 'sns', 'group', 'user' ]);

    io.configure(function() {
	io.enable('browser client etag');
	// io.set('log level', 3);
	io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling' ]);
    });

    var Room = io.of('/room').on('connection', function(socket) {
	var joinedRoom = null;
	socket.on('join', function(data) {
	    if (data && data.roomName) {
		joinedRoom = data.roomName;
		require('./dbchat').hasRoom(joinedRoom, function(hasRoom) {
		    if (hasRoom == true) {
			db.group.findOne({
			    name : joinedRoom
			}, function(error, doc) {
			    
			    doc.attendants.push(data.nickName);
			    
			    db.group.update({
				name : joinedRoom
			    }, {
				$set : {
				    attendants : doc.attendants
				}
			    });
			    socket.join(joinedRoom);
			    socket.emit('joined', {
				isSuccess : true,
				nickName : data.nickName
			    });
			    socket.broadcast.to(joinedRoom).emit('joined', {
				isSuccess : true,
				nickName : data.nickName
			    });
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
	    console.log("========================================================");
	    console.log(data);
	    console.log("joinedRoom : " + data.roomName);
	    var date = new Date();
	    db.sns.insert({
		room : data.roomName,
		data : data.msg,
		user : data.nickName,
		date : date.toJSON()
	    }, function(error) {
		console.log(error);
	    });

	    if (data.roomName) {
		socket.broadcast.to(data.roomName).json.send(data);
	    }
	    console.log("========================================================");
	});
    });
}