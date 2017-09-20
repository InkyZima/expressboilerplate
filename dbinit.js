
const schemas = require("./models/schemas");
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
inkyct("formdata", schemas.formdata).then(() => knex.destroy(() => console.log("closing after creation"))) // )
