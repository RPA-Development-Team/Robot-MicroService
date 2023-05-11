const robotQueries = require('../db/queries').robotQueryList;
const dbConnection = require('../db/dbConnection');

//Robot model constructor
class Robot {
    constructor(robotJson) {
        this.id = robotJson.id;
        this.createdAt = robotJson.createdAt;
        this.updatedAt = robotJson.updatedAt;
        this.robotName = robotJson.robotName;
        this.robotAddress = robotJson.robotAddress;
        this.connected = robotJson.connected;
        this.socketID = robotJson.socketID;
        this.userID = robotJson.userID;
    }

    static async getAllRobots() {
        let queryText = robotQueries.GET_ALL_ROBOTS;
        try {
            const result = await dbConnection.dbQuery(queryText);
            let robotsArray = [];
            result.forEach(robotJson => {
                robotsArray.push(new Robot(robotJson))
            });
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to fetch all robots\n", err);
            return null;
        }
    }

    static async getRobotBySocketID(socketID) {
        let queryText = robotQueries.GET_ROBOT_BY_SOCKET_ID;
        let values = [socketID];
        try {
            const [robotJson] = await dbConnection.dbQuery(queryText, values);
            if (robotJson) {
                let robot = new Robot(robotJson)
                return robot;
            }
            console.log("\nModel-Handling: Robot doesn't exist")
            return null;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to get robot entity\n", err);
            return null;
        }
    }

    static async getRobotByName(robotName) {
        let queryText = robotQueries.GET_ROBOT_BY_NAME;
        let values = [robotName];
        try {
            const [robotJson] = await dbConnection.dbQuery(queryText, values);
            if (robotJson) {
                let robot = new Robot(robotJson)
                return robot;
            }
            console.log("\nModel-Handling: Robot doesn't exist")
            return null;
        } catch (err) {
            console.log("Model-Handling-Error: Robot exists but Failed to get robot entity\n", err);
            return null;
        }
    }

    static async getRobotByAddress(robotAddress) {
        let queryText = robotQueries.GET_ROBOT_BY_ADDRESS;
        let values = [robotAddress];
        try {
            const [robotJson] = await dbConnection.dbQuery(queryText, values);
            if (robotJson) {
                let robot = new Robot(robotJson)
                return robot;
            }
            console.log("\nModel-Handling: Robot doesn't exist")
            return null;
        } catch (err) {
            console.log("Model-Handling-Error: Robot exists but Failed to get robot entity\n", err);
            return null;
        }
    }

    static async registerRobot(metaData, socketID) {
        let queryText = robotQueries.INSERT_ROBOT;
        let { robotName, robotAddress, userID } = metaData
        let updatedAt = new Date().toLocaleString()
        let values = [updatedAt, robotName, robotAddress, socketID, userID];
        try {
            const robotJson = await dbConnection.dbQuery(queryText, values);
            let robot = new Robot(robotJson)
            return robot;
        } catch (err) {
            return null;
        }
    }

    static async updateStatus(robotJson, socketID) {
        try {
            let connected = !robotJson.connected;
            let updatedAt = new Date().toLocaleString();
            let robotAddress = robotJson.robotAddress
            
            let queryText = robotQueries.UPDATE_ROBOT_STATUS;
            let values = [updatedAt, connected, socketID, robotAddress];
            console.log(`Values for query: `, values)

            let updatedRobotJson = await dbConnection.dbQuery(queryText, values);
            let robot = new Robot(updatedRobotJson);
            return robot;
        } catch (err) {
            console.log(`Model-Handling-Error: Failed to Access and Update robot entity\n`)
            return null;
        }
    }

    static async deleteRobot(robotName) {
        let queryText = robotQueries.DELETE_ROBOT;
        let values = [robotName];
        try {
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to delete robot entity\n", err);
            return null;
        }
    }

}

module.exports = Robot;