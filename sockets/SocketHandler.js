const event = require('../utils/eventEmitter');
const scheduler = require('../utils/scheduler');
const { GenerateSocketID } = require("../utils/generateSocketID")
const socketClients = new Map()
const { scheduledTasks } = require('../utils/scheduler')
const fs = require('fs')
const { Console } = require('console');
const Robot = require('../models/robot');
const Job = require('../models/job');
const robotController = require('../controllers/robotController');
const jobController = require('../controllers/jobController');
const { response } = require('express');

async function ServerInit() {
    try {
        let currentDate = new Date().toJSON().slice(0, 10)
        let ServerLogsPath = `././ServerLogs/${currentDate}.txt`

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
            if (robot.connected) {
                Robot.updateStatus(robot, null)
            }
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
    //Designed specifically if server is down and up again 
    try {
        let RobotJobs = await Robot.getRobotJobs(robotAddress);
        if (RobotJobs) {
            RobotJobs.map(async (job) => {
                if (job.status == 'Pending') {
                    //Handle old dates
                    let taskInstance = scheduledTasks.get(job.id)
                    //If task instance doesn't exist, create it [used at Server restart]
                    if (!taskInstance) {
                        let package = await Job.getPackageById(job.packageID)
                        let pkgMetaData = fs.readFileSync(`././packages/${package.name}_${job.id}`, { encoding: 'utf8' });
                        logger.log(`\n[Server] => Re-Scheduling the following package: ${package.name}`)
                        // handle old dates
                        scheduler.handlePkg(JSON.parse(pkgMetaData), job);
                    }
                }
            })
        } else {
            logger.log(`\n[Server] => The Robot doesn't have any Job instances`)
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
            switch (data._event) {
                //2- Client sends his Meta-Data and it's saved in db
                case "client robot metaData":
                    const metaData = data.value
                    logger.log(`\n[Server] => Client robot meta-data Recieved\nClient: [${socketID}]\nRobot Meta-Data: ${metaData}`);
                    try {
                        console.log(`metaData here: `, metaData, `socketID here: `, socketID)
                        await robotController.handleMetaData(metaData, socketID)
                        // let { robotAddress } = JSON.parse(metaData)
                        let { robotAddress } = metaData
                        //Reschedule any old jobs for this robot
                        reScheduleJobs(robotAddress)
                        // Send ping messages
                        //Ping pong messages implementation [Server Manually sending Ping messages]
                        // pingFrame = ''
                        const pingInterval = setInterval(() => {
                            if (socket.readyState === WebSocket.OPEN) {
                                socket.ping();
                                // socket.send(JSON.stringify(pingFrame))
                            }
                        }, 3000);
                        //Ping-pong messages implementation
                        // socket.isAlive = true
                        // const pingInterval = setInterval(() => {
                        //     if (socket.isAlive === false) {
                        //Terminate the connection even if it's open because the client isn't responding
                        //         logger.log(`Client with socket-id: ${socketID} is unresponsive\nConnection will be terminated`);
                        //         return ws.terminate();
                        //     }
                        //     socket.isAlive = false
                        //     socket.ping();
                        // }, 3000);
                    } catch (err) {
                        logger.log(`\n[Server] => Internal Server Error\nError while Sending Robot's Meta-Data\nError-Message: ${err.message}`)
                        let response = {
                            _event: "decline metadata reception",
                            value: ""
                        }
                        // socket.send('decline metadata reception')
                        socket.send(JSON.stringify(response))
                    }
                    break

                // Ping pong messages implementation [Client Manually sending Pong messages]
                // case "pong":
                //     socket.isAlive = true;
                //     logger.log(`Received PONG from client: ${socketID}`);
                //     break

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
                    let package = await Job.getPackageByName(package_name)
                    let response = {
                        _event: "notification",
                        value: {
                            package_name,
                            path: package.path
                        }
                    }
                    event.send(JSON.stringify(response))
                    break
            }
        })
        // Ping pong messages implementation
        // ws.on('pong', () => {
        //     ws.isAlive = true;
        //     console.log(`Received PONG from client: ${socketID}`);
        // });
        // handling robots upon disconnection
        socket.on('close', async () => {
            logger.log(`\n[Server] => Socket [${socketID}] disconnected`)
            try {
                await robotController.handleDisconnection(socketID)
                socketClients.delete(socketID);
                clearInterval(pingInterval);
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
                    let response = {
                        _event: "notification",
                        value: Package
                    }
                    const socketClient = socketClients.get(socketID)
                    //if client not connected get socket with socketid with maintaing in the socket listen
                    logger.log(`[Server] => Sending Package: ${Package.package_name} to Client: ${socketID}`)
                    socketClient.send(JSON.stringify(response));
                    //Update Job status instead of Removing it from database
                    await Job.updateScheduledJob(result.JobID, 'Executed')
                    //Stop task instance 
                    event.emit('JOB COMPLETED', jobID);
                } else {
                    //Get job and change its status to failed
                    console.log(`Execution of Job with id ${jobID} has Failed`)
                    let result = await Job.updateScheduledJob(jobID, "Failed")
                    //stop task instance
                    const task = scheduledTasks.get(parseInt(jobID))
                    task.stop()
                    console.log(`Cancelling execution of task`)
                    scheduledTasks.delete(jobID)
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
