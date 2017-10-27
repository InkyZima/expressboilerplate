/* loads first excel sheet into sqlite */
/* caller args to load more sheets/sheets by name? */

/*usage: cmd shell -> node xlstosql.js [excel file]*/

const path = require("path");
var fs = require("fs");
var sqlite = require("sqlite3");
var XLSX = require('xlsx');
const { execSync } = require('child_process');
var knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: './main.db'
  }
});

var c = console.log;

/**
 * xlstosql
 * import xls(x) file to sqlite table of same name. (drops the table before importing)
 */
exports.xlstosql = (filename, folder, sqldb, sqldbfolder) => {
	var fullfilename = path.join(folder,filename);
		c("this should wordk");
	var workbook = XLSX.readFile(fullfilename);
	c("this should fail due to busy");
	var worksheetname = workbook.SheetNames[0];
	var worksheet = workbook.Sheets[worksheetname];
	filename = filename.split(".")[0];
	c("loading sheet " +worksheetname + " into sql db/table of name " + filename);
	var csvdata = XLSX.utils.sheet_to_csv(worksheet);
	// csv file does always go where the original file is
	var relativecsvfilename = path.relative(sqldbfolder, folder) + "/" + filename + ".csv";
	fs.writeFileSync(relativecsvfilename, csvdata);
	var droptablestring = 'sqlite3 ' + path.join(sqldbfolder,sqldb) + ' "drop table if exists ' + filename + ';"';
	// c(droptablestring);
	execSync(droptablestring);
	var importstring = 'sqlite3 ' + path.join(sqldbfolder,sqldb) + ' ".separator ," ".import ' + relativecsvfilename + ' ' + filename + '"';
	execSync(importstring);
	c("xlstosql: finished re-loading file to sqlite3 main.db");
	// insert or update updatedate
	var knex = require('knex')({
	  dialect: 'sqlite3',
	  connection: {
		filename: './main.db'
	  }
	});
	// create the updates table
	knex.schema.createTableIfNotExists("updates" , (table) => {
		table.string("table");
		table.date("updatedate");
	}).then(() => { c("inside then of createtable");
		// insert the new update
		knex("updates").select().where({table : filename}).then((rows) => {
			if (rows.length < 1) { c("inside select all from updates")
				knex("updates").insert({
					table : filename,
					updatedate : new Date()
				}).catch( err => {throw err});
			} else {
				knex("updates").where({table : filename}).update({
					updatedate : new Date()
				}).catch( err => {throw err});
			}
		});
	});
	return true;
};

// sqlite3.exe ../main.db ".separator ," ".import ../leadmanagement.csv leadmanagement"
// sqlite3.exe ../main.db "drop table if exists leadmanagement;"


/*
var filename = process.argv[2];

if (!filename) {
	c("no xlsx file provided as argument. exiting.");
	return ;
}
if (filename.indexOf(".xls") < 1) {
	c("please provide filename with file extension (e.g. .xlsx). exiting.");
	return ;
}

var workbook = XLSX.readFile(filename);
var worksheetname = workbook.SheetNames[0];
var worksheet = workbook.Sheets[worksheetname];
filename = filename.split(".")[0];
c("loading sheet " +worksheetname + " into sql db/table of name " + filename);
var csvdata = XLSX.utils.sheet_to_csv(worksheet);
fs.writeFileSync(filename + ".csv", csvdata);

execSync('sqlite3.exe main.db "drop table if exists '+filename+';"');
execSync('sqlite3.exe main.db ".separator ," ".import '+filename+'.csv '+filename+'"');
c("xlsx -> csv -> sql done.")
*/
