
const models = require("./models/models");
const inkyauth = require("./inkyauth");
// const val = require("validator");
const knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: './main.db'
  }
});

function inkyct(tablename, schema) {
	return knex.schema.createTableIfNotExists(tablename, function (table) {
		table.increments();
		table.timestamps(true,true);
		for (let field in schema) {
		  table.text(field);
		}
	});
}

// knex.dropTableIfExists("formdata").then(() =>
// inkyct("formdata", schemas.formdata).then(() => knex.destroy(() => console.log("closing after creation"))) // )
// inkyct("users", schemas.user()).then(() => knex.destroy(() => console.log("closing after creation"))) // )

// testvalues

inkyauth.createuser("test2","test2").then(() => console.log("success"), (err) => console.log(err))