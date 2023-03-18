const logsPath = '././logs';
const fs = require('fs');
//Note that the defined path is different fro paths used inside require 

exports.handleLogs= async(machine, logsJson) => {
    let msg = await JSON.stringify(logsJson);
    await fs.appendFileSync(`${logsPath}/${machine.name}`, `\n[Machine-name]: ${machine.name}\n[Machine Connected from socket-id]: ${machine.socketId}\n[Message-Content]: ${msg}\n[Message Received Date]: ${new Date().toISOString()}\n\n`, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}