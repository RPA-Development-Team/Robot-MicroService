const event = require('./utils/eventEmitter');
const scheduler = require('./utils/scheduler');
const logsHandler = require('./utils/logsHandler');
const machineController = require('./machine/machineController');
const Machine = require('./machine/machine');
const fs = require('fs');

function socketListen(io){
    //namespace    
    //1- Client connects to socketServer
    io.on('connection', (socket) => {
        console.log('\n[Server] => New client machine connected: ', socket.id);

        //2- Client sends his Meta-Data and it's saved in db
        socket.on('client machine metaData', async (metaData) => {
            console.log(`\n[Server] => Client machine meta-data Recieved\nClient: [${socket.id}]\nMachine Meta-Data: ${metaData}`);

            //handle multiple machine connecting with same socket  
            //check if the machine already exists to delete previous instance
            let metaData = await JSON.parse(metaData);
            let oldMachine = Machine.getMachineByName(metaData.name)
            if(oldMachine){
                await Machine.deleteMachine(metaData.name);
            }

            //Register machine with new meta-data
            let newMachine = await machineController.registerMachine(metaData, socket.id);
            if(newMachine){
                console.log("[Server] => Machine Meta-data saved successfully at database");
            }
        });

        //3- Client sending logs at execution runtime
        socket.on('client machine message', (msg) => {
            console.log(`\nOne Message Recieved\nClient: [${socket.id}]\nMessage: [${msg}]`);
            logsHandler.handleLogs(socket.id, msg);
        });

        //Receving packages from studio micro-service containing meta-data of pacckage
        //The path of the stored pkg in the cloud is included in the meta-data
        //The pkg meta-data is saved but the pkg itself can be accessed through the cloud path in the meta-data
        socket.on('studio package metaData', (pkgMetaData) => { 
            console.log(`\n[Server] => CLIENT PACKAGE RECEIVED FROM STUDIO-SERVICE\nStudio-service: [${socket.id}]\nPackage: ${JSON.stringify(pkgMetaData)}\n`);
            scheduler.handlePkg(pkgMetaData);
        });

        socket.on('disconnect', async() => {
            console.log(`\n[Server] => Socket [${socket.id}] disconnected`)
            let resultMachine = await Machine.getMachineBySocketId(socket.id);
            let deletedMachine = await Machine.deleteMachine(resultMachine.name);
            if(deletedMachine){
                console.log('\n[Server] => Deleted machine metaData upon disconnection');
            }
        })

        event.on('notification', async(pkgFilePath) => {
            console.log(`\n[Server] => Notification received at server\n`);
            let pkgMetaData = fs.readFile(pkgFilePath);
            let machine = await Machine.getMachineByName(pkgMetaData.machine_name);
            if(!machine){
                console.log(`\n[Server] => Failed to send data - Machine [${pkgMetaData.machine_name}]not connected to the server!`);
            }else{
                let {name, socketId} = machine;
                console.log(`Starting communicating with [${name}]`);
                socket.to(socketId).emit('notification', {msg: "Initiating communication", pkgMetaData: pkgMetaData});
            }
        })

    });

}

module.exports = {
    socketListen,
};