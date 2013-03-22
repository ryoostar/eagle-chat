var Chat = module.exports = {
	users : [],
	rooms : [],
	hasUser : function(nickName) {
		var users = this.users.filter(function(element) {
			return (element === nickName)
		});

		if (users.length > 0) {
			return true;
		} else {
			return false;
		}
	},
	addUser : function(nickName) {
		this.users.push(nickName);
	},
	hasRoom : function(roomName) {
		var rooms = this.rooms.filter(function(element) {
			return (element.name === roomName);
		});

		if (rooms.length > 0) {
			return true;
		} else {
			return false;
		}
	},
	addRoom : function(roomName) {
		this.rooms.push({
			name : roomName,
			attendants : []
		});
	},
	getRoomList : function() {
		return this.rooms.map(function(element) {
			return element.name;
		});
	}
}