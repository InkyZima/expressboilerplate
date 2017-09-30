/*
TODO user rolles
html tables

*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require("express-session");
var bodyParser = require('body-parser');
// TODO necessary in this file? table and schema (for queryies and validations) definitions
var models = require("./models/models");
var inkyauth = require("./inkyauth");
// TODO val necessary in this file?
var val = require("validator");
const KnexSessionStore = require('connect-session-knex')(session);
const sessionstore = new KnexSessionStore(/* options here */); // defaults to a sqlite3 database

// TODO knex necessary in this file?
var knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: './main.db'
  }
});
// auth stuff
// var passport = require('passport');

/** inky utils**/
const c = console.log;
const ct = console.trace;
const throwerr = (err) => {throw err;};


// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

/** init mongo db **/
var mongoose = require('mongoose');
var mongoDB = 'mongodb://inkyzima:1qay2wsx@ds133044.mlab.com:33044/inkyzima';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// init mongoose models
var SomeModel = require('./models/somemodel.js');
var Author = require('./models/author.js');
var Book = require('./models/book.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// ! static before session means no cookie creation for static requests
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
const sessionopts = {
	cookieName: 'session',
	secret: 'the_ink_in_inky',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	store : sessionstore,
	cookie : {httpOnly : false} // TODO why is this needed for normal http get requests?
};
app.use(session(sessionopts));
// app.use(passport.initialize());
// app.use(passport.session());

/** routes go here **/
app.get('/', function(req, res, next) {
	var testdata = new SomeModel({a_string: "testdata string"});
	testdata.save((err, data) => {
		if (err) return console.error(err);
		SomeModel.find().then(data => {
			res.render('index', { title: 'new title' , dbtest: data[0]["a_string"]});
			
		});
	});
	
});

app.get('/singlepageapp', function(req, res, next) {
	c("retriving name information from cookie: " + req.session.name);
	if (!req.session.user) res.render("singlepageapp");
	else res.render("singlepageapp", {user:req.session.user});
		// c(res.get("set-cookie"))

});

// TODO this is nice, but no client side useage/implementation yet. maybe ditch vee for something simlier?
// app.get('/models', function(req, res, next) {res.send(models);});

app.post("/restaurants/create", (req, res, next) => {
	res.cookie("testcookie","testcookie value");
	res.render("restaurants_list");
});


app.post("/formdata" ,(req,res,next) => {
	// here should arrive only form submits. template should actually be drawn automatically.. from the jade view.
	// if the names of the input fields get changed, they have to be changed here too...
	validate(models.formdata,req.body)
	.catch(throwerr)
	.then(() => { // push to db
		return knex("formdata").insert(req.body);
	})
	.catch(throwerr)
	.then(() => { // send response
		res.send("success")})
	// finally pass any error to express error handler
	.catch((err) => next(err));
});
/*
check if session cookie got sent. if yes: return error: already logged in
*/
app.post('/login', (req, res, next) => {
		if (req.session && req.session.user) {next("already logged in");}
		else {
			inkyauth.authuser(req.body.username, req.body.password).then( (authresult) => {
				req.session.user = req.body.username;	
				c(req.session);
				res.send({user: req.session.user});	 
			}, (err) => {next(err)}); 
		}
	} // route
);

// for the client to check if logged in per ajax call. if true: return user. else next->error
app.get("/checklogin", checklogin, (req,res,next) => {
	res.send({user:req.session.user});
});

app.all("/logout", (req,res,next) => {
	req.session.destroy();
	res.send("logout success!");
});

// this page requires login.
app.get("/secretpage", checklogin , (req,res,next) => {
	res.send({user : req.session.user , data :"this data comes from the ajax callback to /secretpage"});
});

app.post('/createuser', (req, res, next) => {
		inkyauth.createuser(req.body.username, req.body.password).then( (authresult) => {
			res.send("success");	 
		}, (err) => {next(err)}); // authuser with then
	} // route
);

/** mogoose model example **/
// Use the SomeModel object (model) to find all SomeModel records
//SomeModel.find(callback_function);

/** error handling **/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  res.status(500).send(err);
});

/** helper functions **/
// TODO maybe move this function to models.js ?
function validate(template, obj) {
	return new Promise ((res,rej) => {
		var tkeys = Object.getOwnPropertyNames(template);
		var okeys = Object.getOwnPropertyNames(obj);

		if (tkeys.length != okeys.length) rej("validated object has a different amount of properties than expected");

		for (var i = 0; i < tkeys.length; i++) {
			if (okeys.indexOf(tkeys[i]) < 0) rej("validated object has differently named properties than expected");
			if (!val[template[tkeys[i]]](obj[tkeys[i]])) rej("validated object failed type validation for property: " + tkeys[i]);
		}

		res("validate return value");		
	}); // promise
} // function


/** custom middleware **/
function checklogin (req,res,next) {	
	if (req.session.user) next();
	else next("checklogin failed: not logged in");
}

module.exports = app;


/*
		c(req.body)
		// here should arrive only form submits. template shuold actually be drawn automatically.. from the jade view.
		// if the names of the input fields get changed, they have to be changed here too...
		validate(template,req.body)
		.then(
		// push to db
		() => {
			// knex("people").insert(req.body).then(null,(err) => {c(err); res.status(500); res.send("db insert failed.")})
			// res.send("validation passed");
			return knex("formdata").insert(req.body);
		},
		// throw propagates error while rejecting .then promise
		(err) => {throw err;})
		.then(
		// sql insert successfull
		() => {res.send("success")},
		(err) => {throw err;})
		// finally pass the error to express error handler
		.catch((err) => next(err));

*/
