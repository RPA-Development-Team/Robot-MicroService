const event = require('./utils/eventEmitter');
const scheduler = require('./utils/scheduler');
const logsHandler = require('./utils/logsHandler');
const machineController = require('./machine/machineController');

function socketListen(io){
    //namespace    
    //1- Client connects to socketServer
    io.on('connection', (socket) => {
        console.log('New client connected: ', socket.id);

        //2- Client sends his Meta-Data and it's saved in db
        socket.on('client metaData', async (metaData) => {
            console.log(`\nClient meta-data Recieved\nClient: [${socket.id}]\nMeta-Data: ${metaData}`);
            let machienResult = await machineController.registerMachine(metaData);
            console.log("from sockets file after registeration...", machienResult);
        });

        //3- Client sending logs at execution runtime
        socket.on('client message', (msg) => {
            console.log(`\nOne Message Recieved\nClient: [${socket.id}]\nMessage: [${msg}]`);
            logsHandler.handleLogs(socket.id, msg);
        });


        socket.on('client package', (pkgMetaData) => { //rcv pkg also
            pkgMetaData = {
                machine_id: 1,
                path: "Desktop/pkgs/pkg1.txt",
                date: "13-3-1", 
                time: "18:18:0"
            };
            console.log(`\nClient package Recieved\nClient: [${socket.id}]\nPackage: [${pkgMetaData}]`);
            // save pkg locally
            //save metadata
            //send date and time to cron-schedule
            //set cron schedule: at date => event emit job must be executed => await socket.emit(notification, send metadate) => end job
            scheduler.handlePkg(socket.id, pkgMetaData);
        });
        //make event emitter for notification => start communicating with the machine 
        //send message => await for machine to pull pkg => rcv logs and save them => ...
        event.on('notification', (pkgMetaData, socketId) => {
            console.log(`Notification received from ${socketId}\nPackage Meta-date: ${pkgMetaData}`);
        })

    });
}

module.exports = {
    socketListen,
};