const fs = require('fs')
const { Console } = require('console');
const path = require('path')

let currentDate = new Date().toJSON().slice(0, 10)
let dbLogsPath = path.join(__dirname, `../dbLogs/${currentDate}.txt`);

// Check if the file exists
if (!fs.existsSync(dbLogsPath)) {
    // If the file doesn't exist, create a new file and write initial data
    fs.writeFileSync(dbLogsPath, '-----SERVER-DB-LOGS-----\n');
}

// Open the file in append mode
const dbOutput = fs.createWriteStream(dbLogsPath, { flags: 'a' });
exports.dbLogger = new Console({ stdout: dbOutput });