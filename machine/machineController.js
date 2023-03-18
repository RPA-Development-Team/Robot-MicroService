const Machine = require('./machine');
const scheduler = require('../utils/scheduler');

exports.getMachines = async () => {
    let result = await Machine.getAllMachines();
    if(result)
        return result;
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
    if(deletedMachine)
        return deletedMachine;
    else
        return JSON.stringify({error: "Failed to delete machine!"});
}

// Receving packages from studio micro-service containing meta-data of package
// The path of the stored pkg in the cloud is included in the meta-data
// The pkg meta-data is saved but the pkg itself can be accessed through the cloud path in the meta-data

// socket.on('studio package metaData', (pkgMetaData) => { 
//     console.log(`\n[Server] => CLIENT PACKAGE RECEIVED FROM STUDIO-SERVICE\nStudio-service: [${socket.id}]\nPackage: ${JSON.stringify(pkgMetaData)}\n`);
//     scheduler.handlePkg(pkgMetaData);
// });

exports.getPkg = (req, res) => {
    let pkgMetaData = req.body;
    pkgMetaData.dateReceived = new Date().toString();
    console.log(`\n[Server] => CLIENT PACKAGE RECEIVED FROM STUDIO-SERVICE\nPackage: ${JSON.stringify(pkgMetaData)}\n`);
    scheduler.handlePkg(pkgMetaData);
    res.status(200).send("Server sent package to scheduler");
}