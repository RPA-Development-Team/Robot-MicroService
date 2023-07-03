const event = require('../utils/eventEmitter');
const scheduler = require('../utils/scheduler');
const { GenerateSocketID } = require("../utils/generateSocketID")
const socketClients = new Map()
const { scheduledTasks } = require('../utils/scheduler')
const fs = require('fs')
const { Console } = require('console');
const Robot = require('../models/robot');
const robotController = require('../controllers/robotController');

async function ServerInit() {
    try {
        let currentDate = new Date().toJSON().slice(0, 10)
        let ServerLogsPath = `./ServerLogs/${currentDate}.txt`

        // Check if the file exists
        if (!fs.existsSync(ServerLogsPath)) {
            // If the file doesn't exist, create a new file and write initial data
            fs.writeFileSync(ServerLogsPath, '-----SERVER-LOGS-----\n');
        }

        // Open the file in append mode
        const output = fs.createWriteStream(ServerLogsPath, { flags: 'a' }); let logger = new Console({ stdout: output });
        global.logger = logger

        //For all robot update their status
        const robots = await Robot.getAllRobots()
        robots.map((robot) => {
            Robot.updateStatus(robot, null)
        })
        // let result = await Robot.deleteAllRobots()
        socketClients.clear()
        scheduledTasks.clear()
        logger.log(`\nSERVER-INITIATED @[${new Date().toISOString()}]`)
    } catch (err) {
        logger.log(`\n[Server] => Internal Server Error\nServer Initialization Error\nError-Message: ${err.message}`)
    }
}

async function reScheduleJobs(robotAddress) {
    try {
        let scheduledJobs = await Robot.getRobotJobs(robotAddress);
        if (scheduledJobs) {
            scheduledJobs.map(async (job) => {
                if (job.status == 'Pending') {
                    let package = await Robot.getPackageById(job.packageID)
                    let pkgMetaData = fs.readFileSync(`./packages/${package.name}`, { encoding: 'utf8' });
                    logger.log(`\n[Server] => Re-Scheduling the following package: ${package.packageName}`)
                    // handle old dates
                    scheduler.handlePkg(JSON.parse(pkgMetaData), job);
                }
            })
        } else {
            logger.log(`\n[Server] => No packages to re-schedule`)
        }
    } catch (err) {
        logger.log(`\n[Server] => Internal Server Error\nError while re-scheduling packages\nError-Message: ${err.message}`)
    }
}

function socketListen(wss) {
    //1- Client connects to socketServer
    wss.on('connection', (socket) => {
        const socketID = GenerateSocketID()
        socketClients.set(socketID, socket)
        logger.log('\n[Server] => New client robot connected: ', socketID);

        socket.on("message", async (message) => {
            const data = JSON.parse(message)
            switch (data.event) {
                //2- Client sends his Meta-Data and it's saved in db
                case "client robot metaData":
                    const metaData = data.value
                    logger.log(`\n[Server] => Client robot meta-data Recieved\nClient: [${socketID}]\nRobot Meta-Data: ${metaData}`);
                    try {
                        await robotController.handleMetaData(metaData, socketID)
                        let { robotAddress } = JSON.parse(metaData)
                        //Reschedule any old jobs for this robot
                        reScheduleJobs(robotAddress)
                    } catch (err) {
                        logger.log(`\n[Server] => Internal Server Error\nError while Sending Robot's Meta-Data\nError-Message: ${err.message}`)
                        socket.send('decline metadata reception')
                    }
                    break
                // 3- Client sending logs as JSON at execution runtime
                case "client robot message":
                    const logsJson = data.value
                    logger.log(`\nOne Message Recieved\nClient: [${socketID}]\nMessage: [${logsJson}]`);
                    try {
                        await robotController.handleLogs(socketID, logsJson)
                    } catch (err) {
                        logger.log(`\n[Server] => Internal Server Error\nError while Recieving Robot's Message\nError-Message: ${err.message}`)
                    }
                    break
                //resending failed received packages
                case "decline pkg reception":
                    const package_name = data.value
                    let pkgFilePath = `./packages/${package_name}`;
                    data = {
                        event: "notification",
                        value: pkgFilePath
                    }
                    event.send(JSON.stringify(data))
                    break
            }
        })
        // handling robots upon disconnection
        socket.on('close', async () => {
            logger.log(`\n[Server] => Socket [${socketID}] disconnected`)
            try {
                await robotController.handleDisconnection(socketID)
                socketClients.delete(socketID);
            } catch (err) {
                logger.log(`\n[Server] => Internal Server Error\nError while Updating Robot's Status upon disconnection\nError-Message: ${err.message}`)
            }
        })
        //scheduled notification at server for sending packages
        event.on('notification', async (pkgFilePath, jobID) => {
            logger.log(`\n[Server] => Notification received at server\n`);
            try {
                let result = await robotController.handleSchedulerNotification(pkgFilePath)
                //If robot is connected then send the package to it
                if (result) {
                    let { Package } = result
                    data = {
                        event: "notification",
                        value: Package
                    }
                    const socketClient = socketClients.get(socketID)
                    //if client not connected get socket with socketid with maintaing in the socket listen
                    logger.log(`[Server] => Sending Package: ${Package.package_name} to Client: ${socketID}`)
                    socketClient.send(JSON.stringify(data));
                    //Update Job status instead of Removing it from database
                    await Robot.updateScheduledJob(result.JobID, 'Executed')
                    //Stop task instance 
                    event.emit('JOB COMPLETED', jobID);
                }
            } catch (err) {
                logger.log(`\n[Server] => Internal Server Error\nError while Sending scheduled package\nError-Message: ${err.message}`)
            }
        })
    });
}

module.exports = {
    socketListen,
    ServerInit
};
