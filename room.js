module.exports = function(server) {
	console.log('room.js에 들어왔어');
	var io = require('socket.io').listen(server);

	io.configure(function() {
		io.enable('browser client etag');
		//io.set('log level', 3);
		io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
	});

	var Room = io.of('/room').on('connection', function(socket) {
		var joinedRoom = null;
		console.log('=======================================room enter');
		socket.on('join', function(data) {
			console.log(data);
			if (require('./chat').hasRoom(data.roomName)) {
				joinedRoom = data.roomName;

				socket.join(joinedRoom);
				socket.emit('joined', {
					isSuccess : true,
					nickName : data.nickName
				});
				socket.broadcast.to(joinedRoom).emit('joined', {
					isSuccess : true,
					nickName : data.nickName
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
			console.log("joinedRoom"+joinedRoom);
			if (joinedRoom) {
				socket.broadcast.to(joinedRoom).json.send(data);
			}
			console.log("========================================================");
		});
	});
}