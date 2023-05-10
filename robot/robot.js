const robotQueries = require('../db/queries').robotQueryList;
const dbConnection = require('../db/dbConnection');

//Robot model constructor
class Robot{
    constructor(updatedAt, robotName, robotAddress, connected, socketID, userID){
        this.updatedAt = updatedAt;
        this.robotName = robotName;
        this.robotAddress = robotAddress;
        this.connected = connected;
        this.socketID = socketID;
        this.userID = userID;
    }

    static async getAllRobots(){
        let queryText = robotQueries.GET_ALL_ROBOTS;
        try{
            const result = await dbConnection.dbQuery(queryText);
            let robotsArray = [];
            result.forEach(robotJson => {
                robotsArray.push(new Robot(robotJson.updatedAt, robotJson.robotName, robotJson.robotAddress, robotJson.connected, robotJson.socketID, robotJson.userID))
            });
            return robotsArray;
        }catch(err){
            console.log("Model-Handling-Error: Failed to fetch all robots\n", err);
            return null;
        }
    }

    static async getRobotBySocketID(socketID){
        let queryText = robotQueries.GET_ROBOT_BY_SOCKET_ID;
        let values = [socketID];
        try{
            const [robotJson] = await dbConnection.dbQuery(queryText, values);
            if(robotJson){
                let robot = new Robot(robotJson.updatedAt, robotJson.robotName, robotJson.robotAddress, robotJson.connected, robotJson.socketID, robotJson.userID)
                return robot;
            }
            console.log("\nModel-Handling: Robot doesn't exist")
            return null;
        }catch(err){
            console.log("Model-Handling-Error: Failed to get robot entity\n", err);
            return null;
        } 
    }

    static async getRobotByName(robotName){
        let queryText = robotQueries.GET_ROBOT_BY_NAME;
        let values = [robotName];
        try{
            const [robotJson] = await dbConnection.dbQuery(queryText, values);
            if(robotJson){
                let robot = new Robot(robotJson.updatedAt, robotJson.robotName, robotJson.robotAddress, robotJson.connected, robotJson.socketID, robotJson.userID)
                return robot;
            }
            console.log("\nModel-Handling: Robot doesn't exist")
            return null;
        }catch(err){
            console.log("Model-Handling-Error: Robot exists but Failed to get robot entity\n", err);
            return null;
        } 
    }

    static async registerRobot(updatedAt, robotName, robotAddress, connected, socketID, userID){
        let queryText = robotQueries.INSERT_ROBOT;
        let values = [updatedAt, robotName, robotAddress, connected, socketID, userID];
        try{
            const robotJson = await dbConnection.dbQuery(queryText, values);
            let robot = new Robot(robotJson.updatedAt, robotJson.robotName, robotJson.robotAddress, robotJson.connected, robotJson.socketID, robotJson.userID)
            return robot;
        }catch(err){
            return null;
        }
    }

    static async deleteRobot(robotName){
        let queryText = robotQueries.DELETE_ROBOT;
        let values = [robotName];
        try{
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        }catch(err){
            console.log("Model-Handling-Error: Failed to delete robot entity\n", err);
            return null;
        }
    }

}

module.exports = Robot;