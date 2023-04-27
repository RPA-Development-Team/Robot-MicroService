const event = require('./utils/eventEmitter');
const logsHandler = require('./utils/logsHandler');
const machineController = require('./machine/machineController');
const fs = require('fs');

function socketListen(io){
    //namespace    
    //1- Client connects to socketServer
    io.on('connection', (socket) => {
        console.log('\n[Server] => New client machine connected: ', socket.id);
        //2- Client sends his Meta-Data and it's saved in db
        socket.on('client machine metaData', async (metaData) => {
            console.log(`\n[Server] => Client machine meta-data Recieved\nClient: [${socket.id}]\nMachine Meta-Data: ${metaData}`);
            try{
                //handle multiple machine connecting with same socket  
                //check if the machine already exists to delete previous instance
                metaData = await JSON.parse(metaData); 
                let oldMachine = await machineController.getMachineByName(metaData.name);
                if(oldMachine){
                    await machineController.deleteMachine(metaData.name);
                }
                //Register machine with new meta-data
                let newMachine = await machineController.registerMachine(metaData, socket.id);
                if(newMachine){
                    console.log("\n[Server] => Machine Meta-data saved successfully at database");
                }
            }catch(err){
                console.log(`\n[Server] => Internal Server Error\nError while Sending Machine's Meta-Data\nError-Message: ${err.message}`)
                socket.emit('decline metadata reception')
            }
        });

        // 3- Client sending logs as JSON at execution runtime
        socket.on('client machine message', async(logsJson) => {
            console.log(`\nOne Message Recieved\nClient: [${socket.id}]\nMessage: [${logsJson}]`);
            try{
                let machine = await machineController.getMachineBySocketId(socket.id);
                logsHandler.handleLogs(machine, logsJson);
            }catch(err){
                console.log(`\n[Server] => Internal Server Error\nError while Recieving Machine's Message\nError-Message: ${err.message}`)
            }
        });

        //handling machines upon disconnection
        socket.on('disconnect', async() => {
            console.log(`\n[Server] => Socket [${socket.id}] disconnected`)
            try{
                let resultMachine = await machineController.getMachineBySocketId(socket.id);
                if(resultMachine){
                    const deletedMachine = await machineController.deleteMachine(resultMachine.name);
                    if(deletedMachine)
                        console.log('\n[Server] => Deleted machine metaData successfully upon disconnection');
                    else
                        console.log("\n[Server] => Failed to Delete machine metaData upon disconnection");
                }else{
                    console.log('\n[Server] => Machine disconnected without being registered');
                }
            }catch(err){
                console.log(`\n[Server] => Internal Server Error\nError while Deleting Machine's Meta-Data upon disconnection\nError-Message: ${err.message}`)
            }
        })

        //scheduled notification at server for sending packages
        event.on('notification', async(pkgFilePath) => {
            console.log(`\n[Server] => Notification received at server\n`);
            try{
                let pkgMetaData = await fs.readFileSync(pkgFilePath, 'utf-8');
                pkgMetaData = JSON.parse(pkgMetaData);
                let machine = await machineController.getMachineByName(pkgMetaData.machine_name);
                if(!machine){
                    console.log(`\n[Server] => Failed to send data\nMachine [${pkgMetaData.machine_name}] not connected to the server!`);
                }else{
                    let {name, socketId} = machine;
                    console.log(`Starting communicating with [${name}] at socket [${socketId}]`);
                    socket.to(socketId).emit('notification', {msg: "Initiating communication", pkgMetaData: pkgMetaData});
                }
            }catch(err){
                console.log(`\n[Server] => Internal Server Error\nError while Sending scheduled package\nError-Message: ${err.message}`)
            }
        })

        //resending failed received packages
        socket.on('decline pkg reception', (package_name) => {
            let pkgFilePath = `./packages/${package_name}`;
            event.emit('notification', pkgFilePath)
        })

    });

}

module.exports = {
    socketListen,
};