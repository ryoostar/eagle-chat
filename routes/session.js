/**
 * 
 */
module.exports = function(app) {
    app.dynamicHelpers({
	session : function(req,res){
	    console.log("****** make session");
	    console.log(req.session);
	    return req.session;
	}
    });
}