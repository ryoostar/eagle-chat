var Chat = module.exports = {
    db : function() {
	var mongojs = require('mongojs');
	return mongojs('172.16.2.4:27017/eagleagle', [ 'user', 'sns', 'group' ]);
    },
    hasUser : function(nickName, callback) {
	console.log(nickName + ' 사용자가 DB에 있는지 확인합니다.');
	this.db().user.findOne({
	    nickname : nickName
	}, function(error, doc) {
	    if (error) {
		console.log('사용자 조회 error---------------------' + error);
		callback(false);
	    }

	    if (doc) {
		console.log("조회된 사용자:" + doc.nickname);
		callback(true);
	    }else{
		callback(false);
	    }
	});
    },
    addUser : function(nickName) {
	console.log(nickName + ' 사용자를 DB에 저장합니다.');
	this.db().user.insert({
	    nickname : nickName
	}, function(error) {
	    if (error)
		console.log('사용자 insert error---------------------' + error);
	    else
		console.log('사용자 저장 성공!');
	});
    },
    hasRoom : function(groupName, callback) {
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
    addRoom : function(groupName) {
	console.log(groupName + '그룹을 DB에 저장합니다.');
	this.db().group.insert({
	    name : groupName,
	    attendants : []
	}, function(error) {
	    if (error)
		console.log('group insert error---------------------' + error);
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
    },
    getUsers : function(groupName, callback) {
	console.log(groupName + '그룹의 사용자들을 DB에 조회 합니다.');
	this.db().group.find({
	    name : groupName
	}, function(error, docs) {
	    callback(docs.attendants);
	});
    }
}