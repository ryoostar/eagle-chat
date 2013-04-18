(function() {
	window.Noti = {
		notifications : [],
		check_browser_support : function() {
			if (!window.webkitNotifications) {
				alert("Your browser does not support the Notification API please use Chrome for the demo.");
				return false;
			} else {
				console.log("Your browser support the Notification API.");
				return true;
			}
		},
		plain_text_notification : function(image, title, content) {
			if (window.webkitNotifications
					&& window.webkitNotifications.checkPermission() == 0) {
				console.log(Noti.notifications.length);
				if (Noti.notifications.length == 3) {
					Noti.notifications.shift().close();
				}

				var notification = window.webkitNotifications
						.createNotification(image, title, content);
				Noti.notifications.push(notification);
				notification.show();
			}
		},
		request_permission : function() {
			// 0 means we have permission to display notifications
			// chrome://settings/contentExceptions#notifications
			if (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0) {
				window.webkitNotifications
						.requestPermission(Noti.check_permission);
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
		showMessage : function(data) {
			var ol = $('#stream-items');

			var content = $("<div class='content'>");
			var stream = $("<div class='stream-item-header'>");
			var img = $("<img class='avatar js-action-profile-avatar'/>").attr(
					"src", "../images/lava.jpg");
			var text = $("<p class='js-tweet-text'>" + data.msg + "</p>");

			stream.append(img).append(
					"<strong class='fullname js-action-profile-name show-popup-with-id>"
							+ data.nickName + "</strong>");
			content.append(stream).append(text);

			var li = $("<li class='js-stream-item stream-item'></li>");
			li.append(content)
			$(ol).append(li);
			Noti.plain_text_notification("../images/lava.jpg", data.nickName
					+ "(Eagle Chat)", data.msg);
		}
	};
}());

$(document)
		.ready(
				function() {
					var room = io.connect('/room');

					// $("#form_enter").submit();

					room.on('connect', function() {
						room.emit('join', {
							roomName : $('#roomName').val(),
							nickName : $('#myName').val()
						});
					});

					room
							.on(
									'joined',
									function(data) {
										if (data.isSuccess) {
											data.msg = data.nickName
													+ ' 님이 입장하셨습니다.';
											Chat.showMessage(data);

											var attendant = $("<div class='js-account-summary account-summary js-actionable-user promoted-account js-profile-popup-actionable'></div>");
											var content = $("<div class='content'>");
											var img = $(
													"<img class='avatar js-action-profile-avatar'/>")
													.attr("src",
															"../images/lava.jpg");
											$("#attendants")
													.append(
															attendant
																	.append(content
																			.append(
																					img)
																			.append(
																					"<b class='fullname'>"
																							+ data.nickName
																							+ "</b>")));
										}
									});

					room.on('message', function(data) {
						Chat.showMessage(data);
					});

					// Notification available check
					Noti.check_browser_support();

					$('#btn_send').click(function() {
						Noti.request_permission();
						$('#form_room').submit();
					});

					// send message
					$('#form_room').submit(function(e) {
						e.preventDefault();
						var messageBox = $('#message');
						var msg = messageBox.text();
						if ($.trim(msg) !== '') {
							var nickName = $('#myName').val();
							Chat.showMessage({
								nickName : nickName,
								msg : msg
							});
							room.json.send({
								nickName : nickName,
								msg : msg
							});
							messageBox.text('');
						}
					});
				});
