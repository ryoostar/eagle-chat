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
	    if (window.webkitNotifications && window.webkitNotifications.checkPermission() == 0) {
		console.log(Noti.notifications.length);
		if (Noti.notifications.length == 3) {
		    Noti.notifications.shift().close();
		}

		var notification = window.webkitNotifications.createNotification(image, title,
			content);
		Noti.notifications.push(notification);
		notification.show();
	    }
	},
	request_permission : function() {
	    // 0 means we have permission to display notifications
	    // chrome://settings/contentExceptions#notifications
	    if (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0) {
		window.webkitNotifications.requestPermission(Noti.check_permission);
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
    window.Talk = {
	showMessage : function(talk) {
	    this.addTalk(talk);
	    Noti.plain_text_notification("/images/"+talk.character+".png", talk.userNickName + "(Eagle Talk)",
		    talk.message);
	},
	addTalk : function(talk) {
	    var ol = $('#stream-items');
	    var content = $("<div class='content'>");
	    var stream = $("<div class='stream-item-header'>");
	    var img = $("<img class='avatar js-action-profile-avatar'/>").attr("src", "/images/"+talk.character+".png");
	    var message = $("<p class='js-tweet-text'>" + talk.message + "</p>");
	    var nickName = $("<strong class='fullname'>"
		    + talk.userNickName + "</strong>");
	    $(stream).append(img).append(message);
	    var talkDate = new Date(talk.date);
	    if(talk.date == ""){
		talkDate = new Date();
	    }
	    var joinedDateStr = talkDate.getFullYear()+"-"+talkDate.getMonth()+"-"+talkDate.getDate()+" "+talkDate.getHours()+":"+talkDate.getMinutes()+":"+talkDate.getSeconds();
	    content.append(stream).append(nickName);
	    content.append(stream).append($("<p>"+joinedDateStr+"</p>"));

	    var li = $("<li class='stream-item'></li>");
	    li.append(content)
	    $(ol).prepend(li);
	},
	addAttendant : function(attentant) {
	    var attendstr = "<div>";
	    attendstr += "<div class='content'>";
	    attendstr += "<img class='avatar js-action-profile-avatar' src='/images/"+attentant.character+".png'/>";
	    attendstr += "<b class='fullname'>" + attentant.nickName + "</b>";
	    attendstr += "</div></div>";
	    $("#attendants").append($(attendstr));
	}
    };
}());

$(document).ready(function() {
    var group = io.connect('/group');

    group.on('connect', function() {
	group.emit('join', {
	    groupName : $('#groupName').val(),
	    nickName : $('#myName').val(),
	    character : $('#character').val()
	});
    });

    group.on('joined', function(data) {
	if (data.isSuccess) {
	    var talks = data.talks;
	    if (talks) {
		for ( var i = 0; i < talks.length; i++) {		    
		    Talk.addTalk(talks[i]);
		}
	    }
	    var talk = new TalkModel();
	    if (data.isNewMember == true) {
		Talk.addAttendant(data);
		talk.message = data.nickName + " 님이 그룹에 새롭게 참여하였습니다.";
	    } else {
		talk.message = data.nickName + " 님이 방문했습니다.";
	    }
	    talk.userNickName = data.nickName;
	    talk.date = new Date().toJSON();
	    talk.character = data.character;
	    Talk.showMessage(talk);
	}
    });

    group.on('message', function(data) {
	Talk.showMessage(data);
    });

    // Notification available check
    Noti.check_browser_support();

    $('#btn_send').click(function() {
	Noti.request_permission();
	$('#form_room').submit();
    });
    
    $('#btn_grouplist').click(function() {
	location.href = '/enter';
    });

    // send message
    $('#form_room').submit(function(e) {
	e.preventDefault();
	var msg = $('#message').text();
	if ($.trim(msg) !== '') {
	    var talk = new TalkModel();
	    talk.userNickName = $('#myName').val();
	    talk.groupName = $('#groupName').val();
	    talk.character = $('#character').val();
	    talk.message = msg;

	    Talk.showMessage(talk);
	    group.json.send(talk);
	    $('#message').text('');
	}
    });
});
