const Robot = require('./robot');
const scheduler = require('../utils/scheduler');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const validatePackage = require('../utils/validatePackage')
const logsPath = '././logs';

exports.getRobots = async (req, res) => {
    let result = await Robot.getAllRobots();
    if(result)
        res.status(200).send(result);
    else
        return JSON.stringify({error: "Failed to get robots list!"}); 
}

exports.getRobotBySocketID = async (socketID) => {
    let result = await Robot.getRobotBySocketID(socketID);
    return result;
};

exports.getRobotByName = async (robotName) => {
    let result = await Robot.getRobotByName(robotName);
    return result;
};

exports.getRobotByAddress = async (robotAddress) => {
    let result = await Robot.getRobotByAddress(robotAddress);
    return result;
};

exports.registerRobot = async(metaData, socketID) => {
    let robotResult = await Robot.registerRobot(metaData, socketID); 
    return robotResult;
}

exports.updateStatus = async(resultRobot, socketID) => {
    let result = await Robot.updateStatus(resultRobot, socketID);
    return result;
}

exports.deleteRobot = async(robotName) => {
    let deletedRobot = await Robot.deleteRobot(robotName); 
    return deletedRobot;
}

// Receving packages from studio micro-service containing meta-data of package
// The path of the stored pkg in the cloud is included in the meta-data
// The pkg meta-data is saved but the pkg itself can be accessed through the cloud path in the meta-data
exports.getPkg = (req, res) => {
    let pkgMetaData = req.body;
    try{
        let result = validatePackage(pkgMetaData)
        if(result){
            pkgMetaData.dateReceived = new Date().toString();
            pkgMetaData.jobId = uuidv4();
            scheduler.handlePkg(pkgMetaData);
            res.status(200).send("Server sent package to scheduler");
        }else{
            console.log(`\n[Server] => Package from studio service is missing required data`)
            res.send({alert: "Package missing required data"});
        }
    }catch(err){
        console.log(`\n[Server] => Error while receiving package from studio service`)
        res.send({alert: "Package hasn't been received successfully"});
    }
}

exports.getRobotLogs = async(req, res) => {
    let {robotName} = req.params;
    let robot = await this.getRobotByName(robotName);
    if(robot){
        try{
            let robotLogs = await fs.readFileSync(`${logsPath}/${robot.robotName}`, 'utf-8');
            let context = {robot: robot, robotLogs: robotLogs};
            res.status(200).send(context);
        }catch(err){
            res.send({alert: "Robot hasn't sent any logs yet"});
        }
    }else{
        res.send({alert: "Robot doesn't exist"});
    }
}
