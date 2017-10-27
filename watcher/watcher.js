const path = require('path');
const fs = require("fs");
const xlstosql = require("./xlstosql");

const c = console.log;
// c(__dirname)
// var watcher = fs.watch(path.join(__dirname,"../magic"));
// var counter = 0;
// two structures logging files and file changes = bad.
var watchfor = [];
var changelog = {};

exports.init = (folder, filenamearray , sql, sqlfolder) => {
	watchfor = filenamearray;
	for (var i in watchfor) {
		changelog[watchfor[i]] = { "lastupdate":0 };
	}
	var watcher = fs.watch(folder, {} , (e,file) => {
		updatexlstosql(e,file, folder, filenamearray , sql, sqlfolder);
	});
	// only for testing:
	xlstosql.xlstosql("leadmanagement.xlsx", folder, sql, sqlfolder);
	xlstosql.xlstosql("dealerrights.xlsx", folder, sql, sqlfolder);

};



// watcher.close();

function updatexlstosql(e,file, folder, filenamearray , sql, sqlfolder) {
	// c("watcher: detected change to file " + file);
	if (file.split(".")[1] === "csv" || (watchfor.indexOf(file) === -1 && watchfor.indexOf(file.split(".")[0]) === -1 )) {
		// c("watcher: file not what is being watched for");
		return ;
	}
	if(fs.existsSync(path.join(folder , file))) {
		if ((new Date().getTime() - changelog[file.split(".")[0]].lastupdate) > 1000) {
			changelog[file.split(".")[0]].lastupdate = new Date().getTime();
			c("watcher: importing excel file to sql");
			xlstosql.xlstosql(file, folder, sql, sqlfolder);
		}
	}
}