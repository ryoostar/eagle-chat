module.exports = {
    db : function() {
	var mongojs = require('mongojs');
	return mongojs('172.16.2.4:27017/eagleagle', [ 'user', 'sns', 'group' ]);
    },
    insertTalk : function(data, callback) {
	var date = new Date();
	data.date = date.toJSON();
	
	this.db().sns.insert(data, function(error) {
	    if (error)
		console.log("insertTalk Error Message : " + error);

	    callback();
	});
    },
    getGroupTalks2 : function(group, callback) {
	this.db().sns.find({
	    groupName : group
	},function(error, docs) {
	    if (error)
		console.log("getGroupTalks Error Message : " + error);
	    
	    callback(docs);
	});
    },
    getGroupTalks : function(group, callback) {
    	this.db().sns.find({
		groupName : group
	}).sort({$natural:-1}).limit(10).toArray(function(err,doc){
		if(err)	console.log("getGroupTalks Error Message : " + err);
		console.log("docs " + doc);
		console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		callback(doc);
	});
    }
}
