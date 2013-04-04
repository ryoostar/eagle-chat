(function() {
	window.Noti = {
		check_browser_support : function() {
			if (!window.webkitNotifications) {
				alert("Your browser does not support the Notification API please use Chrome for the demo.");
			} else {
				console.log("Your browser support the Notification API.");
			}
		},
		plain_text_notification : function(image, title, content) {
			if (window.webkitNotifications.checkPermission() == 0) {
				return window.webkitNotifications.createNotification(image,
						title, content);
			}
		},
		request_permission : function() {
			// 0 means we have permission to display notifications
			if (window.webkitNotifications.checkPermission() != 0) {
				window.webkitNotifications.requestPermission(check_permission);
			}
		},
		check_permission : function() {
			switch (window.webkitNotifications.checkPermission()) {
			case 0:
				return true;
				break;
			case 2:
				alert("You have denied access to display notifications.");
				break;
			default:
				return false;
				break;
			}
		},
		browser_support_notification : function() {
			if (window.webkitNotifications) {
				return true;
			} else {
				return false;
			}
		}

	};
	window.Chat = {
		showMessage : function(msg) {
			var chatWindow = $('#chatWindow');
			chatWindow.append($('<p>').text(msg));
			chatWindow.scrollTop(chatWindow.height());
			Noti.plain_text_notification("", "Eagle Chat", msg).show();
		}

	};
}());

$(document).ready(function() {
	var room = io.connect('/room');
	var myName = $('#myName').text();

	$('#form_enter').submit(function() {
		// $('#form_enter').submit();
	});

	Noti.check_browser_support();

	$('#btn_send').click(Noti.request_permission);

	room.on('connect', function() {
		room.emit('join', {
			roomName : $('#roomName').text(),
			nickName : myName
		});
	});

	room.on('joined', function(data) {
		if (data.isSuccess) {
			Chat.showMessage(data.nickName + ' 님이 입장하셨습니다.');
		}
	});

	$('#form_room').submit(function(e) {
		e.preventDefault();
		var messageBox = $('#message');
		var msg = messageBox.val();
		if ($.trim(msg) !== '') {
			Chat.showMessage(myName + ' : ' + msg);
			room.json.send({
				nickName : myName,
				msg : msg
			});
			messageBox.val('');
		}
	});

	room.on('message', function(data) {
		Chat.showMessage(data.nickName + ' : ' + data.msg);
	});
});
