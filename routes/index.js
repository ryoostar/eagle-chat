/*
 * 
 */
var UserDao = require('../eagle_modules/dao/userDao'), GroupDao = require('../eagle_modules/dao/groupDao');
var UserService = require('../eagle_modules/service/userService');
exports.index = function(req, res) {
    console.log("*********index");
    console.log(req.session);
    
    if(req.session && req.session.nickName && req.session.character){
	res.redirect('/enter?nickName='+req.session.nickName+'&character='+req.session.character);
    }else{
        res.render('index', {
    		title : 'Eagleagle SNS Alpha'
        });
    }
};

exports.talk = function(req, res) {
    console.log('***********talk');
};

exports.enter = function(req, res) {
    console.log('***********enter');
    
    if(req.body.nickName){
        req.session.nickName = req.body.nickName;
        req.session.character = req.body.character;
    }
    
    console.log(req.session);
    
    var isSuccess = false, nickName = req.session.nickName, character = req.session.character;
    if (nickName && nickName.trim() !== '') {

	UserDao.hasUser(nickName, function(hasUser) {
	    if (hasUser === false) {
		UserDao.addUser(nickName, character);
	    }
	    req.session.nickName = nickName;
	    isSuccess = true;

	    GroupDao.getRoomList(function(groupList) {
		res.render('enter', {
		    isSuccess : isSuccess,
		    nickName : nickName,
		    groupList : groupList,
		    character : character
		});
	    });
	});
    }else{
	res.redirect('/');
    }
};

// exports.entergroup = function(req, res) {
// console.log('***********enter group');
// console.log(req.body);
// UserService.enterGroup(req, res);
// };

exports.makegroup = function(req, res) {
    console.log('***********makegroup');
    console.log(req.body);
    var groupName = req.body.groupName, character = req.body.character;
    if (groupName && groupName.trim() !== '') {
	GroupDao.hasGroup(groupName, function(hasGroup) {
	    var isSuccess = false;
	    if (hasGroup == false) {
		isSuccess = true;
		GroupDao.addRoom(groupName, function() {
		    res.render('makeGroup', {
			isSuccess : isSuccess,
			groupName : groupName,
			character : character
		    });
		});
	    } else {
		isSuccess = false;
	    }
	});
    } else {
	res.render('makeGroup', {
	    isSuccess : false,
	    groupName : groupName,
	    character : character
	});
    }
};

exports.join = function(req, res) {
    console.log('***********join');
    console.log(req.params);
    var isSuccess = false, groupName = req.params.id, character = req.params.character;
    GroupDao.hasGroup(groupName, function(hasGroup) {
	if (hasGroup == true) {
	    UserDao.getUsers(groupName, function(attendants) {
		res.render('group', {
		    isSuccess : true,
		    groupName : groupName,
		    nickName : req.session.nickName,
		    users : attendants,
		    character : character
		});
	    });
	}
    });
};

exports.logout = function(req,res){
    console.log('***********logout');
    req.session.destroy();
    console.log('****Destroyed Session:'+req.session);
    res.redirect('/');
}