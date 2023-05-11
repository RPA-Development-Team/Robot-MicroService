const event = require('./utils/eventEmitter');
const logsHandler = require('./utils/logsHandler');
const robotController = require('./robot/robotController');
const fs = require('fs');

function socketListen(io){
    //1- Client connects to socketServer
    io.on('connection', (socket) => {
        console.log('\n[Server] => New client robot connected: ', socket.id);
        //2- Client sends his Meta-Data and it's saved in db
        socket.on('client robot metaData', async (metaData) => {
            console.log(`\n[Server] => Client robot meta-data Recieved\nClient: [${socket.id}]\nRobot Meta-Data: ${metaData}`);
            try{
                //handle multiple robot connecting with same socket  
                //check if the robot already exists to delete previous instance
                metaData = await JSON.parse(metaData); 
                let oldRobot = await robotController.getRobotByAddress(metaData.robotAddress); 
                if(oldRobot){
                    await robotController.updateStatus(metaData, socket.id); 
                }else{
                    //Register robot with new meta-data
                    let newRobot = await robotController.registerRobot(metaData, socket.id);
                    if(newRobot){
                        console.log("\n[Server] => Robot Meta-data saved successfully at database");
                    }
                }
            }catch(err){
                console.log(`\n[Server] => Internal Server Error\nError while Sending Robot's Meta-Data\nError-Message: ${err.message}`)
                socket.emit('decline metadata reception')
            }
        });

        // 3- Client sending logs as JSON at execution runtime
        socket.on('client robot message', async(logsJson) => {
            console.log(`\nOne Message Recieved\nClient: [${socket.id}]\nMessage: [${logsJson}]`);
            try{
                let robot = await robotController.getRobotBySocketId(socket.id);
                logsHandler.handleLogs(robot, logsJson);
            }catch(err){
                console.log(`\n[Server] => Internal Server Error\nError while Recieving Robot's Message\nError-Message: ${err.message}`)
            }
        });

        //handling robots upon disconnection
        socket.on('disconnect', async() => {
            console.log(`\n[Server] => Socket [${socket.id}] disconnected`)
            try{
                let resultRobot = await robotController.getRobotBySocketID(socket.id);
                if(resultRobot){
                    const updatedRobot = await robotController.updateStatus(resultRobot, null);
                    if(updatedRobot)
                        console.log('\n[Server] => Updated robot status successfully upon disconnection');
                    else
                        console.log("\n[Server] => Failed to Update robot Status upon disconnection");
                }else{
                    console.log('\n[Server] => Robot disconnected without being registered');
                }
            }catch(err){
                console.log(`\n[Server] => Internal Server Error\nError while Updating Robot's Status upon disconnection\nError-Message: ${err.message}`)
            }
        })

        // //scheduled notification at server for sending packages
        // event.on('notification', async(pkgFilePath, task) => {
        //     console.log(`\n[Server] => Notification received at server\n`);
        //     try{
        //         let pkgMetaData = fs.readFileSync(pkgFilePath, 'utf-8');
        //         pkgMetaData = await JSON.parse(pkgMetaData);
        //         let robot = await robotController.getRobotByName(pkgMetaData.robot_name);
        //         if(!robot){
        //             console.log(`\n[Server] => Failed to send data\nRobot [${pkgMetaData.robot_name}] not connected to the server!`);
        //         }else{
        //             let {name, socketId} = robot;
        //             console.log(`Starting communicating with [${name}] at socket [${socketId}]`);
        //             socket.to(socketId).emit('notification', {msg: "Initiating communication", pkgMetaData: pkgMetaData});
        //         }
        //         event.emit('JOB COMPLETED', task);
        //     }catch(err){
        //         console.log(`\n[Server] => Internal Server Error\nError while Sending scheduled package\nError-Message: ${err.message}`)
        //     }
        // })

        // //resending failed received packages
        // socket.on('decline pkg reception', (package_name) => {
        //     let pkgFilePath = `./packages/${package_name}`;
        //     event.emit('notification', pkgFilePath)
        // })

    });

}

module.exports = {
    socketListen,
};
