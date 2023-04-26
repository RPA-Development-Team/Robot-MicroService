const Machine = require('./machine');
const scheduler = require('../utils/scheduler');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const logsPath = '././logs';

exports.getMachines = async (req, res) => {
    let result = await Machine.getAllMachines();
    if(result)
        res.status(200).send(result);
    else
        return JSON.stringify({error: "Failed to get machines list!"}); 
}

exports.getMachineBySocketId = async (socketId) => {
    let result = await Machine.getMachineBySocketId(socketId);
    return result;
};

exports.getMachineByName = async (name) => {
    let result = await Machine.getMachineByName(name);
    return result;
};

exports.registerMachine = async(metaData, socketId) => {
    let {name, type} = metaData;
    let machineResult = await Machine.registerMachine(name, type, socketId); 
    return machineResult;
}

exports.deleteMachine = async(name) => {
    let deletedMachine = await Machine.deleteMachine(name); 
    return deletedMachine;
}

// Receving packages from studio micro-service containing meta-data of package
// The path of the stored pkg in the cloud is included in the meta-data
// The pkg meta-data is saved but the pkg itself can be accessed through the cloud path in the meta-data
exports.getPkg = (req, res) => {
    let pkgMetaData = req.body;
    pkgMetaData.dateReceived = new Date().toString();
    pkgMetaData.jobId = uuidv4();
    console.log(`\n[Server] => CLIENT PACKAGE RECEIVED FROM STUDIO-SERVICE\nPackage: ${JSON.stringify(pkgMetaData)}\n`);
    scheduler.handlePkg(pkgMetaData);
    res.status(200).send("Server sent package to scheduler");
}

exports.getMachineLogs = async(req, res) => {
    let {name} = req.params;
    let machine = await this.getMachineByName(name);
    if(machine){
        try{
            let machineLogs = await fs.readFileSync(`${logsPath}/${machine.name}`, 'utf-8');
            let context = {machine: machine, machineLogs: machineLogs};
            res.status(200).send(context);
        }catch(err){
            res.send({alert: "Machine hasn't sent any logs yet"});
        }
    }else{
        res.send({alert: "Machine doesn't exist"});
    }
}
