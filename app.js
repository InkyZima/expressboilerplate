var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var val = require("validator");

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

app.all("/formdata" ,(req,res,next) => {
	c(req.body)
	res.send("server:done");
});

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

module.exports = app;
