const logsPath = '../logs';
const fs = require('fs');

exports.handleLogs= (socketId, msg) => {
    fs.appendFile(`${logsPath}/${socketId}`, `[${socketId}]: ${msg}\n[Date]: ${new Date().toISOString()}`, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}