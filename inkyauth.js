/*
login process: 
post filled out login form
handle post request server side: pp local with function that checks if user exists and if password is correct:

passwordcheck : bcrypt.compareSync (username, password)
generate password hash: bcrypt.hashSync(password, bcrypt.genSaltSync(), null);

generate session token and cookie handle it
*/
var knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: './main.db'
  }
});

const bcrypt = require("bcrypt");

const c = console.log;

function authuser (username, password) { c("welcome to inkyauth.authuser");
	return new Promise((res,rej) => 
	{
		knex("users").select().where("username",username).then( 
			(rows) => { 
				if (!rows[0]) {
					rej('Incorrect username.');
				}
				else { // username found in db. now compare passwords
					let pwcheckres = bcrypt.compareSync(password , rows[0].password);
					c("result of bcrypt.comparesync: " + pwcheckres);
					if (pwcheckres) {
						res('Auth successful'); 
						 // password correct
					}
					else {
						rej('Incorrect password.'); // password incorrect
					}
				}
			},
			(err) => {rej(err);}
		); // sql error on executing select statement
	}); // promise
}

function createuser (username, password) {
	return new Promise((res,rej) => 
	{
		knex.select().from("users").where("username",username).then( 
			(rows) => { 
				if (!rows[0]) {
					// user doesnt exist. lets create one
					// unless the pw is weak
					if (!strongpassword(password)) rej("password too weak");
										
					knex("users").insert({
						"username" : username,
						"password" : bcrypt.hashSync(password, bcrypt.genSaltSync(), null)
					}).then( (insertres) => res("usercreation successfull.") , (err) => c("knex broke on insert statement" + err));
				} // user creation logic
				else { // username found in db. die.
					rej("username alrdy exists");
				} // else (username exists)
			},
			(err) => {rej(err);}
		); // sql error on executing select statement
	}); // promise
}

/** helpers **/
function strongpassword(password) { // unhashed password
	// TODO check if password is weak
	if (password.length < 6) return false;
	else return true;
}


// test
// authuser("testuser2","testpassword").then((res) => c(res),(err) => c("error on the whole function call: " +err));
// createuser("testuser2","testpasword").then((res) => c(res),(err) => c("error on the whole function call: " +err));


module.exports = {authuser:authuser , createuser:createuser};