$(document).ready(function() {

	function logging(message) {
		$("#log_window").append("<p>" + message + "</p>");
	};

	$('#form_enter').submit(function() {
		$('#form_enter').submit();
	});

	var room = io.connect('/room');
	var chatWindow = $('#chatWindow');
	var messageBox = $('#message');
	var myName = $('#myName').text();

	check_browser_support();
	$('#btn_send').click(request_permission);

	function showMessage(msg) {
		chatWindow.append($('<p>').text(msg));
		chatWindow.scrollTop(chatWindow.height());
		plain_text_notification("", "Eagle Chat", msg).show();
	};

	function check_browser_support() {
		if (!window.webkitNotifications) {
			alert("Your browser does not support the Notification API please use Chrome for the demo.");
		} else {
			logging("Your browser support the Notification API.");
		}
	};
	function plain_text_notification(image, title, content) {
		if (window.webkitNotifications.checkPermission() == 0) {
			return window.webkitNotifications.createNotification(image, title, content);
		}
	};
	function request_permission() {
		// 0 means we have permission to display notifications
		if (window.webkitNotifications.checkPermission() != 0) {
			window.webkitNotifications.requestPermission(check_permission);
		}
	};
	function check_permission() {
		switch(window.webkitNotifications.checkPermission()) {
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
	};
	/**
	 * Check if the browser supports notifications
	 * @return true if browser does support notifications
	 */
	function browser_support_notification() {
		if (window.webkitNotifications) {
			return true;
		} else {
			return false;
		}
	};
	room.on('connect', function() {
		room.emit('join', {
			roomName : $('#roomName').text(),
			nickName : myName
		});
	});

	room.on('joined', function(data) {
		if (data.isSuccess) {
			showMessage(data.nickName + ' 님이 입장하셨습니다.');
		}
	});

	$('#form_room').submit(function(e) {
		e.preventDefault();
		var msg = messageBox.val();
		if ($.trim(msg) !== '') {
			showMessage(myName + ' : ' + msg);
			room.json.send({
				nickName : myName,
				msg : msg
			});
			messageBox.val('');
		}
	});

	room.on('message', function(data) {
		showMessage(data.nickName + ' : ' + data.msg);
	});
});
