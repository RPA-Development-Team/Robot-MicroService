const Machine = require('./machine');

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
