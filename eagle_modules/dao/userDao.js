var assert = require('assert');
module.exports = {
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
	    } else {
		callback(false);
	    }
	});
    },
    updateUser : function(nickName,character){
	console.log(nickName + '('+character+') 사용자를 DB에 수정합니다.');
	this.db().user.update({nickName:nickName}, {$set:{character:character}}, function(err, lastErrorObject) {		
	    assert.ok(!err);
	    if(lastErrorObject){
		assert.equal(lastErrorObject.updatedExisting, true);
		assert.equal(lastErrorObject.n, 1);
	    }
	});
    },
    addUser : function(nickName,character) {
	console.log(nickName + '('+character+') 사용자를 DB에 저장합니다.');
	this.db().user.insert({
	    nickname : nickName,
	    character : character
	}, function(error) {
	    if (error)
		console.log('사용자 insert error---------------------' + error);
	    else
		console.log('사용자 저장 성공!');
	});
    },
    getUsers : function(groupName, callback) {
	console.log(groupName + '그룹의 사용자들을 DB에 조회 합니다.');
	this.db().group.findOne({
	    name : groupName
	}, function(error, doc) {
	    console.log('참가자 수 : ' + doc.attendants.length);
	    callback(doc.attendants);
	});
    },
    getUser : function(nickName, callback){
	console.log(nickName+'사용자의 정보를 DB 조회합니다.');
	this.db().user.findOne({nickName:nickName}, function(error,doc){
	    console.log("조회된 사용자:"+doc.nickName+"("+doc.character+")");
	    callback(doc);
	})
    }
}