const { Console } = require('console');
let currentDate = new Date().toJSON().slice(0, 10)
let ServerLogsPath = `./ServerLogs/${currentDate}.txt`

fs.writeFile(ServerLogsPath, 'Server-Logs', (err) => {
    if (err) throw err
})

const output = fs.createWriteStream(ServerLogsPath);
const logger = new Console({ stdout: output });

module.exports = {
    logger
}