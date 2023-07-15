const fs = require('fs')
const WebSocket = require('ws');
const event = require('../utils/eventEmitter');
const scheduler = require('../utils/scheduler');

const { GenerateSocketID } = require("../utils/generateSocketID")
const { scheduledTasks } = require('../utils/scheduler')
const socketClients = new Map()
const blockedRobots = new Map()

const Robot = require('../models/robot');
const Job = require('../models/job');
const robotController = require('../controllers/robotController');
const {socketLogger} = require('../utils/socketLogger')
const socketMap = {};

async function ServerInit() {
    try {
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
        socketLogger.log(`\nSERVER-INITIATED @[${new Date().toISOString()}]`)
    } catch (err) {
        socketLogger.log(`\n[Server] => Internal Server Error\nServer Initialization Error\nError-Message: ${err.message}`)
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
                        socketLogger.log(`\n[Server] => Re-Scheduling the following package: ${package.name}`)
                        // handle old dates
                        scheduler.handlePkg(JSON.parse(pkgMetaData), job);
                    }
                }
            })
        } else {
            socketLogger.log(`\n[Server] => The Robot doesn't have any Job instances`)
        }
    } catch (err) {
        socketLogger.log(`\n[Server] => Internal Server Error\nError while re-scheduling packages\nError-Message: ${err.message}`)
    }
}

function socketListen(socket) {
    //1- Client connects to socketServer
    // socketServer.on('connection', (socket) => {
    const socketID = GenerateSocketID()
    socketClients.set(socketID, socket)
    socketLogger.log('\n[Server] => New client robot connected: ', socketID);
    //Counter to limit number of meta-data failure
    let metaDataFailure = 0
    socket.on("message", async (message) => {
        const data = JSON.parse(message)
        switch (data._event) {
            //2- Client sends his Meta-Data and it's saved in db
            case "client robot metaData":
                const metaData = data.value
                socketLogger.log(`\n[Server] => Client robot meta-data Recieved\nClient: [${socketID}]\nRobot Meta-Data: ${JSON.stringify(metaData)}`);
                //Check if robot is locked or not
                let isBlocked = blockedRobots.get(metaData.robotAddress) ? true : false
                if (isBlocked) {
                    socketLogger.log(`\n[Server] => ROBOT IS Bloceked, Disconnecting immediately`);
                    socket.close()
                } else {
                    try {
                        await robotController.handleMetaData(metaData, socketID)
                        // let { robotAddress } = JSON.parse(metaData)
                        let { robotAddress } = metaData
                        //Reschedule any old jobs for this robot
                        reScheduleJobs(robotAddress)
                        // Send ping messages
                        const pingInterval = setInterval(() => {
                            if (socket.readyState === WebSocket.OPEN) {
                                socket.ping();
                            }
                        }, 10000);
                        socketMap[socketID] = pingInterval;
                        //Ping-pong messages implementation
                        // socket.isAlive = true
                        // const pingInterval = setInterval(() => {
                        //     if (socket.isAlive === false) {
                        //Terminate the connection even if it's open because the client isn't responding
                        //         socketLogger.log(`Client with socket-id: ${socketID} is unresponsive\nConnection will be terminated`);
                        //         return socket.terminate();
                        //     }
                        //     socket.isAlive = false
                        //     socket.ping();
                        // }, 3000);
                    } catch (err) {
                        socketLogger.log(`\n[Server] => Internal Server Error\nError while Sending Robot's Meta-Data\nError-Message: ${err.message}`)
                        if (metaDataFailure == 10) {
                            socketLogger.log(`\n[Server] => Internal Server Error\nTo much failure in Sending Robot's Meta-Data\nBlocking robot`)
                            blockedRobots.set(metaData.robotAddress, true)
                            socket.close()
                        } else {
                            let response = {
                                _event: "Decline metaData reception",
                                value: " "
                            }
                            // metaDataFailure++
                            // socket.send('decline metadata reception')
                            socket.send(JSON.stringify(response))
                        }
                    }
                }
                break
            // 3- Client sending logs as JSON at execution runtime
            case "client robot message":
                const logsJson = data.value
                socketLogger.log(`\nOne Message Recieved\nClient: [${socketID}]\nMessage: [${logsJson}]`);
                try {
                    await robotController.handleLogs(socketID, logsJson)
                } catch (err) {
                    socketLogger.log(`\n[Server] => Internal Server Error\nError while Recieving Robot's Message\nError-Message: ${err.message}`)
                }
                break
            //resending failed received packages
            case "Decline pkg reception":
                try {
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
                } catch (err) {
                    socketLogger.log(`\n[Server] => Internal Server Error\nError while Resending Package\nError-Message: ${err.message}`)
                }
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
        socketLogger.log(`\n[Server] => Socket [${socketID}] disconnected`)
        try {
            let result = await robotController.handleDisconnection(socketID)
            socketClients.delete(socketID);
            if (result) {
                clearInterval(socketMap[socketID]);
            }
        } catch (err) {
            socketLogger.log(`\n[Server] => Internal Server Error\nError while Updating Robot's Status upon disconnection\nError-Message: ${err.message}`)
        }
    })
    //scheduled notification at server for sending packages
    event.on('notification', async (pkgFilePath, jobID) => {
        socketLogger.log(`\n[Server] => Notification received at server\n`);
        try {
            let job = await Job.GetJobById(jobID);
            console.log(job);
            let robot = await Robot.getRobotById(job.robotID);
            console.log(robot);
            console.log(socketID);
            if (robot.socketID != socketID) {
                return;
            }
            let result = await robotController.handleSchedulerNotification(pkgFilePath)
            //If robot is connected then send the package to it
            if (result) {
                let { Package } = result
                let response = {
                    _event: "notification",
                    value: JSON.stringify(Package)
                }
                const socketClient = socketClients.get(socketID)
                //if client not connected get socket with socketid with maintaing in the socket listen
                socketLogger.log(`[Server] => Sending Package: ${Package.package_name} to Client: ${socketID}`)
                socketClient.send(JSON.stringify(response));
                //Update Job status instead of Removing it from database
                await Job.updateScheduledJob(result.JobID, 'Executed')
                //Stop task instance 
                event.emit('JOB COMPLETED', jobID);
                // if (result.repeat){
                //regieter new job with the same old job and schedule it
                // }
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
            socketLogger.log(`\n[Server] => Internal Server Error\nError while Sending scheduled package\nError-Message: ${err.message}`)
        }
    })
    // });
}

module.exports = {
    socketListen,
    ServerInit,
    socketClients
};
