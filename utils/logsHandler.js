const logsPath = '././ClientLogs';
const fs = require('fs');
//Note that the defined path is different fro paths used inside require 

exports.handleLogs= async(robot, logsJson) => {
    let msg = await JSON.stringify(logsJson);
    await fs.appendFileSync(`${logsPath}/${robot.robotName}`, `[Machine-name]: ${robot.robotName}\n[Machine Connected from socket-id]: ${robot.socketID}\n[Message-Content]: ${msg}\n[Message Received Date]: ${new Date().toLocaleString()}\n\n`, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}