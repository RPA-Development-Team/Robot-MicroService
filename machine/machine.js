const machineQueries = require('../db/queries').machineQueryList;
const dbConnection = require('../db/dbConnection');

//Machine model constructor
class Machine{
    constructor(id, name, type, socketId){
        this.id = id;
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
                machinesArray.push(new Machine(machineJson.id, machineJson.name, machineJson.type))
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
            let machine = new Machine(result.id, result.name, result.type, result.socketId);
            return machine;
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
            let machine = new Machine(result.id, result.name, result.type, result.socketId);
            return machine;
        }catch(err){
            console.log("Model-Handling-Error: Failed to get machine entity\n", err);
            return null;
        } 
    }

    static async registerMachine(name, type, socketId){
        let queryText = machineQueries.INSERT_MACHINE;
        let values = [name, type, socketId];
        try{
            const result = await dbConnection.dbQuery(queryText, values);
            let machine = new Machine(result.id, result.name, result.type, result.socketId);
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