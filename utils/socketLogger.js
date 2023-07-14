const fs = require('fs')
const { Console } = require('console');
const path = require('path')

let currentDate = new Date().toJSON().slice(0, 10)
let ServerLogsPath = path.join(__dirname, `../ServerLogs/${currentDate}.txt`);

// Check if the file exists
if (!fs.existsSync(ServerLogsPath)) {
    // If the file doesn't exist, create a new file and write initial data
    fs.writeFileSync(ServerLogsPath, '-----SERVER--SOCKET-LOGS-----\n');
}
// Open the file in append mode
const socketOutput = fs.createWriteStream(ServerLogsPath, { flags: 'a' });
exports.socketLogger = new Console({ stdout: socketOutput });