const Robot = require('./robot');
const scheduler = require('../utils/scheduler');
const {scheduledTasks} = require('../utils/scheduler')
const fs = require('fs');
const validatePackage = require('../utils/validatePackage');
const logsHandler = require('../utils/logsHandler');
const logsPath = '././logs';

exports.handleMetaData = async (metaData, socketID) => {
    return new Promise(async (resolve, reject) => {
        try {
            //handle multiple robot connecting with same socket  
            //check if the robot already exists to update its status
            metaData = JSON.parse(metaData);
            let oldRobot = await Robot.getRobotByAddress(metaData.robotAddress);
            if (oldRobot) {
                await Robot.updateStatus(metaData, socketID);
                console.log(`\n[Server] => Updated robot Status successfully`)
                resolve()
            } else {
                //Register robot with new meta-data
                let newRobot = await Robot.registerRobot(metaData, socketID);
                if (newRobot)
                    console.log("\n[Server] => Robot Meta-data saved successfully at database");
                resolve()
            }
        } catch (err) {
            console.log(`\n[Server] => Error while handling robot meta-data`, err.message)
            reject(err)
        }
    })
}

exports.handleLogs = async (socketID, logsJson) => {
    let robot = await Robot.getRobotBySocketID(socketID);
    if (!robot) {
        throw new Error(`Unregistered robot sending logs`)
    }
    logsHandler.handleLogs(robot, logsJson);
}

exports.handleDisconnection = async (socketID) => {
    let resultRobot = await Robot.getRobotBySocketID(socketID);
    if (resultRobot) {
        const updatedRobot = await Robot.updateStatus(resultRobot, null);
        if (updatedRobot)
            console.log('\n[Server] => Updated robot status successfully upon disconnection');
        else
            console.log("\n[Server] => Failed to Update robot Status upon disconnection");
    } else {
        console.log('\n[Server] => Robot disconnected without being registered');
    }
}

// Receving packages from studio micro-service containing meta-data of package
// The path of the stored pkg in the cloud is included in the meta-data
// The pkg meta-data is saved but the pkg itself can be accessed through the cloud path in the meta-data
exports.receivePackage = async (req, res, next) => {
    let MetaData = req.body;
    try {
        let result = await validatePackage(MetaData)
        if (result) {
            let { Package } = MetaData
            const [job] = await Robot.RegisterJob(MetaData)
            let pkgMetaData = {
                Package,
                JobID: job.id
            }
            scheduler.handlePkg(pkgMetaData, job);
            res.status(200).send("Server sent package to scheduler");
        } else {
            console.log(`\n[Server] => Package from studio service is missing required data`)
            res.send({ Alert: "Package missing required data" });
        }
    } catch (err) {
        console.log(`\n[Server] => Error while receiving package from studio service`, err.message)
        res.send({ Alert: "Package hasn't been received successfully" });
    }
}

exports.handleSchedulerNotification = async (pkgFilePath) => {
    let pkgMetaData = fs.readFileSync(pkgFilePath, 'utf-8');
    pkgMetaData = await JSON.parse(pkgMetaData);
    let { Pacakge, JobID } = pkgMetaData
    let job = await Robot.GetJobById(JobID)
    let robot = await Robot.getRobotById(job.robotID);
    if (!robot) {
        console.log(`\n[Server] => Failed to send data\nRobot [${robot.robotName}] not connected to the server!`);
        return null
    } else {
        let { robotName, socketID } = robot;
        console.log(`Starting communicating with [${robotName}] at socket [${socketID}]`);
        return pkgMetaData
    }
}

exports.handleRobotLogs = async (req, res) => {
    let { robotName } = req.params;
    let robot = await this.getRobotByName(robotName);
    if (robot) {
        try {
            let robotLogs = await fs.readFileSync(`${logsPath}/${robot.robotName}`, 'utf-8');
            let context = { robot: robot, robotLogs: robotLogs };
            res.status(200).send(context);
        } catch (err) {
            res.send({ alert: "Robot hasn't sent any logs yet" });
        }
    } else {
        res.send({ alert: "Robot doesn't exist" });
    }
}

exports.ForceJob = async (req, res) => {
    try {
        let { jobID } = req.params
        const task = scheduledTasks.get(parseInt(jobID))

        if (task) {
            task._task._execution();
            let context = { Job: jobID, Status: 'Forced to be executed successfully' };
            res.status(200).send(context);
        } else {
            throw new Error(`Job with ID ${jobID} not found`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ Alert: 'Failed to force job' });    }
}

exports.CancelJob = async (req, res) => {
    try {
        let { jobID } = req.params
        const job = await Robot.GetJobById(jobID)
        const task = scheduledTasks.get(parseInt(jobID))

        if (job) {
            if(!task){
                console.log(`No associated Task instance found`)
                throw new Error(`Job with ID ${jobID} doesn't have associated cron-task`);            
            }
            task.stop();
            console.log(`Cancelled Task instance successfully`)
            let result = await Robot.removeScheduledJob(jobID)
            console.log(`Removed Job instance successfully`)

            let context = { Job: jobID, Status: 'Cancelled Job successfully' };
            res.status(200).send(context);
        } else {
            throw new Error(`Job with ID ${jobID} not found`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ Alert: 'Failed to force job' });    
    }
}
