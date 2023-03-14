const Machine = require('./machine');

exports.getMachines = async () => {
    let result = await Machine.getAllMachines();
    if(result)
        return result;
    else
        return res.status(400).send(JSON.stringify({error: "Failed to get machines list!"})); 
}

exports.getMachineById = async (id) => {
    let result = await Machine.getMachineById(id);
    if(result)
        return result;
    else
        return res.status(400).send(JSON.stringify({error: "Failed to get machine!"}));
      
};

exports.registerMachine = async(metaData) => {
    let {name, type} = JSON.parse(metaData);
    let machineResult = await Machine.registerMachine(name, type); 
    if(machineResult)
        return machineResult;
    else
        return res.status(400).send(JSON.stringify({error: "Failed to create machine!"}));
}


