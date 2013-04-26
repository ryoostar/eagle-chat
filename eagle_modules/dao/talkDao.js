module.exports = {
    db : function() {
	var mongojs = require('mongojs');
	return mongojs('172.16.2.4:27017/eagleagle', [ 'user', 'sns', 'group' ]);
    },
    insertTalk : function(data, callback) {
	var date = new Date();
	this.db().sns.insert({
	    group : data.roomName,
	    message : data.msg,
	    user : data.nickName,
	    date : date.toJSON()
	}, function(error) {
	    if (error)
		console.log("insertTalk Error Message : " + error);

	    callback();
	});
    }
}