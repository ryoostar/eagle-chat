module.exports = {
    enterGroup : function(req, res) {
	GroupDao.getRoomList(function(groupList) {
	    if (req.session.nickName) {
		res.render('enter', {
		    isSuccess : true,
		    nickName : req.session.nickName,
		    groupList : groupList
		});
	    } else {
		res.render('enter', {
		    isSuccess : false,
		    nickName : ''
		});
	    }
	});
    }
}