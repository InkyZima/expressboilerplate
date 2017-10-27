/*
TODO:
forgot passwort -> mail to user
reset password page
*/

var inkyauth = require("../inkyauth");
const c = console.log;
exports.getlogin = () => {};

exports.postlogin =  (req, res, next) => { c("checking login")
	if (req.session && req.session.user) {
		// next("already logged in");
		res.redirect(req.header('Referer'));
		}
	else {
		inkyauth.authuser(req.body.username, req.body.password).then( (authresult) => {
			req.session.user = req.body.username;	
			c(req.session);
			res.redirect(req.header('Referer'))
			// res.send("newskeleton/main");	 
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
	c("logout: " + req.baseUrl)
	res.redirect(req.header('Referer'));
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