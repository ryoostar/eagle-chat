/**
 * User Model Object
 */
var UserModel = function() {
    // 사용자명
    this.name = "";

    // 별명
    this.nickName = "";
}

/**
 * Group Model Object
 */
var GroupModel = function() {
    // 그룹명
    this.name = "";

    // 참여자들
    this.attentants = new Array();
}

/**
 * Talk Model Object
 */
var TalkModel = function() {
    // 별명
    this.userNickName = "";

    // 사용자명
    this.userName = "";

    // 글
    this.message = "";

    // 그룹명
    this.groupName = "";

    // 입력일자
    this.date = "";
}
