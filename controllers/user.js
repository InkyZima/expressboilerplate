/*
TODO:
forgot passwort -> mail to user
reset password page
*/

exports.getlogin = () => {};

exports.postlogin =  (req, res, next) => {
	if (req.session && req.session.user) {next("already logged in");}
	else {
		inkyauth.authuser(req.body.username, req.body.password).then( (authresult) => {
			req.session.user = req.body.username;	
			c(req.session);
			res.send({user: req.session.user});	 
		}, (err) => {next(err)}); 
	}
}; // route

exports.getcheckloginclient = (req,res,next) => {
	if (req.session.user) res.send({user:req.session.user});
	else next("checklogin failed: not logged in");
	
};

exports.checklogin =(req,res,next) => {	
	if (req.session.user) next();
	else next("checklogin failed: not logged in");
}

exports.getlogout = (req,res,next) => {
	req.session.destroy();
	res.send("logout success!");
};

exports.getsignup = () => {};
exports.postsignup = (req, res, next) => {
	inkyauth.createuser(req.body.username, req.body.password).then( (authresult) => {
		res.send("success");	 
	}, (err) => {next(err)}); // authuser with then
} // route

/*
exports.getaccount = () => {};
exports.postupdateprofile = () => {};
exports.postUpdatePassword = (req, res, next) => {}
exports.getReset = (req, res, next) => {}
exports.postReset = (req, res, next) => {}
exports.postDeleteAccount = (req, res, next) => {}
exports.getForgot = (req, res, next) => {}
exports.postForgot = (req, res, next) => {}

*/