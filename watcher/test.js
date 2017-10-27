
const { execSync } = require('child_process');

var filename = "leadmanagement";
execSync('sqlite3.exe ../main.db "drop table if exists leadmanagement;"');
execSync('sqlite3.exe ../main.db ".separator ," ".import ../'+filename+'.csv '+filename+'"');
console.log("done")