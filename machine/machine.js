const machineQueries = require('../db/queries').machineQueryList;
const dbConnection = require('../db/dbConnection');

//Machine model constructor
class Machine{
    constructor(id, name, type){
        this.id = id;
        this.name = name;
        this.type = type;
    }

    static async getAllMachines(){
        let queryText = machineQueries.GET_ALL_MACHINES;
        try{
            const result = await dbConnection.dbQuery(queryText);
            let machinesArray = [];
            result.forEach(machineJson => {
                machinesArray.push(new Machine(machineJson.id, machineJson.name, machineJson.type))
            });
            return machinesArray;
        }catch(err){
            console.log("Model-Handling-Error: Failed to fetch all machines\n", err);
            return null;
        }
    }

    static async getMachineById(id){
        let queryText = machineQueries.GET_MACHINE_BY_ID;
        let values = [id];
        try{
            const [result] = await dbConnection.dbQuery(queryText, values);
            let machine = new Machine(result.id, result.name, result.type);
            return machine;
        }catch(err){
            console.log("Model-Handling-Error: Failed to get machine entity\n", err);
            return null;
        } 
    }

    static async registerMachine(name, type){
        let queryText = machineQueries.INSERT_MACHINE;
        let values = [name, type];
        try{
            const result = await dbConnection.dbQuery(queryText, values);
            let machine = new Machine(result.id, result.name, result.type);
            return machine;
        }catch(err){
            return null;
        }
    }

}

module.exports = Machine;