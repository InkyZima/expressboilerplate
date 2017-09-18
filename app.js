var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var val = require("validator");
var knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: './main.db'
  }
});

const c = console.log;
const ct = console.trace;
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
	res.render("singlepageapp");
});

app.post("/restaurants/create", (req, res, next) => {
	res.cookie("testcookie","testcookie value");
	res.render("restaurants_list");
});

// encapsulation to save route-relevant data
(function () {
	const template = {restaurantname: val.isEmail, doesdelivery: val.isBoolean};
	app.post("/formdata" ,(req,res,next) => {
		c(req.body)
		// here should arrive only form submits. template shuold actually be drawn automatically.. from the jade view.
		// if the names of the input fields get changed, they have to be changed here too...
		validate(template,req.body)
		.then(
		// push to db
		() => {
			// knex("people").insert(req.body).then(null,(err) => {c(err); res.status(500); res.send("db insert failed.")})
			res.send("validation passed");
			return knex("formdata").insert(req.body);
		},
			// validation problem
			(err) => {c(err); res.status(400); res.send(err)}
		)
		.then(
		// sql insert successfull
		(res) => {res.send("success")} , 
		// sql insert problem
		(err) => {res.status(400); res.send(err)});	
	});
})();

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
  res.status(err.status || 500);
  res.render('error');
});

/** helper functions **/

function validate(template, obj) {
	return new Promise ((res,rej) => {
		var tkeys = Object.getOwnPropertyNames(template);
		var okeys = Object.getOwnPropertyNames(obj);

		if (tkeys.length != okeys.length) rej("validated object has a different amount of properties than expected");

		for (var i = 0; i < tkeys.length; i++) {
			if (okeys.indexOf(tkeys[i]) < 0) rej("validated object has differently named properties than expected");
			if (!template[tkeys[i]](obj[tkeys[i]])) rej("validated object failed type validation for property: " + tkeys[i]);
		}

		res(true);		
	}); // promise
} // function


module.exports = app;
