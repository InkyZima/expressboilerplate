/*
TODO user rolles

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
var sqliteconfig = {
  dialect: 'sqlite3',
  connection: { filename: './main.db'}
};
// TODO knex necessary in this file?
var knex = require('knex')(sqliteconfig);

/** inky utils**/
const c = console.log;
const ct = console.trace;
const throwerr = (err) => {throw err;};

const homeC = require("./controllers/home");
const userC = require("./controllers/user");
const spaC = require("./controllers/spa");
const restaurantC = require("./controllers/restaurant");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const sessionopts = {
	cookieName: 'session',
	secret: 'the_ink_in_inky',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	store : sessionstore,
	cookie : {httpOnly : false} // TODO why is this needed for normal http get requests?
};
app.use(session(sessionopts));

/** routes go here **/
// user
app.post('/login', userC.postlogin);
app.get("/checklogin", userC.getcheckloginclient);
app.get("/logout", userC.getlogout);
app.post('/createuser', userC.postsignup);
app.get("/bootstrap", (req,res,next ) =>res.render("bootstrap-inky-layout"));
app.get("/newskeleton", (req,res,next ) =>res.render("newskeleton"));
// main
app.get('/', homeC.index);

// spa
app.get('/singlepageapp', (req,res,next) => {c("asdfaf"); next()} ,spaC.getspa);
app.post("/restaurants/create", restaurantC.postrestaurant);
app.post("/formdata" , spaC.postformdata);

app.get("/secretpage", userC.checklogin , (req,res,next) => {
	res.send({user : req.session.user , data :"this data comes from the ajax callback to /secretpage"});
});

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

module.exports = app;
