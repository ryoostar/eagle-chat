module.exports = {
    db : function() {
	var mongojs = require('mongojs');
	var dbconnection = mongojs('172.16.2.4:27017/eagleagle', [ 'user', 'sns', 'group' ]); 
	return dbconnection;
    },
    hasGroup : function(groupName, callback) {
	console.log(groupName + '그룹이 DB에 있는지 확인합니다.');
	if (!groupName)
	    callback(false);

	this.db().group.findOne({
	    name : groupName
	}, function(error, doc) {
	    if (error) {
		console.log('group find error---------------------' + error);
	    } else {
		if (doc) {
		    console.log('group find success---------------------' + doc.name);
		    callback(true);
		} else {
		    console.log(groupName + '그룹이 없습니다.');
		    callback(false);
		}
	    }
	});
    },
    getGroup : function(groupName, callback) {
	console.log(groupName + '그룹이 DB에 있는지 확인합니다.');
	if (!groupName) {
	    callback(null);
	} else {
	    this.db().group.findOne({
		name : groupName
	    }, function(error, doc) {
		if (error) {
		    console.log('group find error---------------------' + error);
		} else {
		    if (doc) {
			console.log('group find success---------------------' + doc.name);
		    } else {
			console.log(groupName + '그룹이 없습니다.');
		    }
		}
		callback(doc);
	    });
	}
    },
    updateGroupAttendants : function(group, callback) {
	console.log(group.name + "그룹을 업데이트 합니다.");
	this.db().group.update({
	    name : group.name
	}, {
	    $set : {
		attendants : group.attendants
	    }
	}, function(error) {
	    callback();
	});
    },
    addRoom : function(groupName,callback) {
	console.log(groupName + '그룹을 DB에 저장합니다.');
	this.db().group.insert({
	    name : groupName,
	    attendants : []
	}, function(error) {
	    if (error)
		console.log('group insert error---------------------' + error);
	    else
		callback();
	});
    },
    getRoomList : function(callback) {
	console.log('전체 그룹을 DB에 조회 합니다.');
	this.db().group.find({}, function(error, docs) {
	    console.log("조회된 그룹 갯수 : " + docs.length);
	    if (!docs) {
		docs = [];
	    }
	    callback(docs);
	});
    }
}