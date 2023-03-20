const machineQueries = require('../db/queries').machineQueryList;
const dbConnection = require('../db/dbConnection');

//Machine model constructor
class Machine{
    constructor(name, type, socketId){
        this.name = name;
        this.type = type;
        this.socketId = socketId;
    }

    static async getAllMachines(){
        let queryText = machineQueries.GET_ALL_MACHINES;
        try{
            const result = await dbConnection.dbQuery(queryText);
            let machinesArray = [];
            result.forEach(machineJson => {
                machinesArray.push(new Machine(machineJson.name, machineJson.type, machineJson.socketId))
            });
            return machinesArray;
        }catch(err){
            console.log("Model-Handling-Error: Failed to fetch all machines\n", err);
            return null;
        }
    }

    static async getMachineBySocketId(socketId){
        let queryText = machineQueries.GET_MACHINE_BY_SOCKET_ID;
        let values = [socketId];
        try{
            const [result] = await dbConnection.dbQuery(queryText, values);
            if(result){
                let machine = new Machine(result.name, result.type, result.socketid);
                return machine;
            }
            console.log("\nModel-Handling: Machine doesn't exist")
            return null;
        }catch(err){
            console.log("Model-Handling-Error: Failed to get machine entity\n", err);
            return null;
        } 
    }

    static async getMachineByName(name){
        let queryText = machineQueries.GET_MACHINE_BY_NAME;
        let values = [name];
        try{
            const [result] = await dbConnection.dbQuery(queryText, values);
            if(result){
                let machine = new Machine(result.name, result.type, result.socketid); //naming is case esensitive
                return machine;
            }
            console.log("\nModel-Handling: Machine doesn't exist")
            return null;
        }catch(err){
            console.log("Model-Handling-Error: Machine exists but Failed to get machine entity\n", err);
            return null;
        } 
    }

    static async registerMachine(name, type, socketId){
        let queryText = machineQueries.INSERT_MACHINE;
        let values = [name, type, socketId];
        try{
            const result = await dbConnection.dbQuery(queryText, values);
            let machine = new Machine(result.name, result.type, result.socketId);
            return machine;
        }catch(err){
            return null;
        }
    }

    static async deleteMachine(name){
        let queryText = machineQueries.DELETE_MACHINE;
        let values = [name];
        try{
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        }catch(err){
            console.log("Model-Handling-Error: Failed to delete machine entity\n", err);
            return null;
        }
    }

}

module.exports = Machine;