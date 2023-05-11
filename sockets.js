const event = require('./utils/eventEmitter');
const scheduler = require('./utils/scheduler');
const fs = require('fs')
const Robot = require('./robot/robot');
const robotController = require('./robot/robotController');

async function reSchedulePackages() {
    try {
        let packages = await Robot.getPreScheduledPackages();
        if (packages) {
            packages.map((package) => {
                let pkgMetaData = fs.readFileSync(`./packages/${package.packageName}`, { encoding: 'utf8'});
                console.log(`\n[Server] => Re-Scheduling the following package: ${package.packageName}`)
                scheduler.handlePkg(JSON.parse(pkgMetaData));
            })
        } else {
            console.log(`\n[Server] => No packages to re-schedule`)
        }
    } catch (err) {
        console.log(`\n[Server] => Internal Server Error\nError while re-scheduling packages\nError-Message: ${err.message}`)
    }
}

function socketListen(io) {
    //1- Client connects to socketServer
    io.on('connection', (socket) => {
        console.log('\n[Server] => New client robot connected: ', socket.id);
        //2- Client sends his Meta-Data and it's saved in db
        socket.on('client robot metaData', async (metaData) => {
            console.log(`\n[Server] => Client robot meta-data Recieved\nClient: [${socket.id}]\nRobot Meta-Data: ${metaData}`);
            try {
                await robotController.handleMetaData(metaData, socket.id)
            } catch (err) {
                console.log(`\n[Server] => Internal Server Error\nError while Sending Robot's Meta-Data\nError-Message: ${err.message}`)
                socket.emit('decline metadata reception')
            }
        });

        // 3- Client sending logs as JSON at execution runtime
        socket.on('client robot message', async (logsJson) => {
            console.log(`\nOne Message Recieved\nClient: [${socket.id}]\nMessage: [${logsJson}]`);
            try {
                await robotController.handleLogs(socket.id, logsJson)
            } catch (err) {
                console.log(`\n[Server] => Internal Server Error\nError while Recieving Robot's Message\nError-Message: ${err.message}`)
            }
        });

        //handling robots upon disconnection
        socket.on('disconnect', async () => {
            console.log(`\n[Server] => Socket [${socket.id}] disconnected`)
            try {
                await robotController.handleDisconnection(socket.id)
            } catch (err) {
                console.log(`\n[Server] => Internal Server Error\nError while Updating Robot's Status upon disconnection\nError-Message: ${err.message}`)
            }
        })

        //scheduled notification at server for sending packages
        event.on('notification', async (pkgFilePath, task) => {
            console.log(`\n[Server] => Notification received at server\n`);
            try {
                let result = await robotController.handleSchedulerNotification(pkgFilePath)
                //If robot is connected then send the package to it
                if (result) {
                    socket.to(socket.id).emit('notification', { msg: "Initiating communication", pkgMetaData: result });
                    //Remove scheduled package from database
                    await Robot.removeScheduledPackage(result.package_name)
                    //Stop task instance 
                    event.emit('JOB COMPLETED', task);
                }
            } catch (err) {
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
    reSchedulePackages
};
