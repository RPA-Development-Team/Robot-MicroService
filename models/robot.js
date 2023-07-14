const RobotQueries = require('../db/queries').RobotQueryList;
const JobQueries = require('../db/queries').JobQueryList;
const UserQueries = require('../db/queries').UserQueryList;
const dbConnection = require('../db/dbConnection');
const {dbLogger} = require('../utils/dbLogger')

//Robot model 
class Robot {
    static async getRobotBySocketID(socketID) {
        let queryText = RobotQueries.GET_ROBOT_BY_SOCKET_ID;
        let values = [socketID];
        try {
            const [result] = await dbConnection.dbQuery(queryText, values);
            if (result)
                return result;
            dbLogger.log("\nModel-Handling: Robot doesn't exist")
            return null;
        } catch (err) {
            dbLogger.log("Model-Handling-Error: Failed to get robot entity\n", err.message);
            return null;
        }
    }

    static async getRobotByName(name) {
        let queryText = RobotQueries.GET_ROBOT_BY_NAME;
        let values = [name];
        try {
            const [result] = await dbConnection.dbQuery(queryText, values);
            if (result)
                return result;
            dbLogger.log("\nModel-Handling: Robot doesn't exist")
            return null;
        } catch (err) {
            dbLogger.log("Model-Handling-Error: Failed to get robot entity\n", err.message);
            return null;
        }
    }

    static async getRobotById(id) {
        let queryText = RobotQueries.GET_ROBOT_BY_ID;
        let values = [id];
        try {
            const [result] = await dbConnection.dbQuery(queryText, values);
            if (result)
                return result;
            dbLogger.log("\nModel-Handling: Robot doesn't exist")
            return null;
        } catch (err) {
            dbLogger.log("Model-Handling-Error: Failed to get robot entity\n", err.message);
            return null;
        }
    }

    static async getRobotByAddress(robotAddress) {
        let queryText = RobotQueries.GET_ROBOT_BY_ADDRESS;
        let values = [robotAddress];
        try {
            const [result] = await dbConnection.dbQuery(queryText, values);
            if (result)
                return result;
            dbLogger.log("\nModel-Handling: Robot doesn't exist")
            return null;
        } catch (err) {
            dbLogger.log("Model-Handling-Error: Robot exists but Failed to get robot entity\n", err.message);
            return null;
        }
    }

    static async registerRobot(metaData, socketID) {
        let queryText = RobotQueries.INSERT_ROBOT;
        let { robotName, robotAddress, uuid } = metaData
        let userID = await this.mapUserUUID(uuid)
        let updatedAt = new Date().toISOString();
        let values = [updatedAt, robotName, robotAddress, socketID, userID];
try {
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            dbLogger.log("Model-Handling-Error: Failed to Register a new Robot entity\n", err.message);
            return null;
        }
    }

    static async mapUserUUID(uuid) {
        let queryText = UserQueries.GET_USER_BY_UUID;
        let values = [uuid];
        try {
            const [result] = await dbConnection.dbQuery(queryText, values);
            if (result)
                return result.id;
            dbLogger.log("\nModel-Handling: User doesn't exist")
            return null;
        } catch (err) {
            dbLogger.log("Model-Handling-Error: Failed to get user entity\n", err.message);
            return null;
        }
    }

    static async updateStatus(robotJson, socketID) {
        try {
            let connected = !robotJson.connected;
            let updatedAt = new Date().toISOString();
            let robotAddress = robotJson.robotAddress

            let queryText = RobotQueries.UPDATE_ROBOT_STATUS;
            let values = [updatedAt, connected, socketID, robotAddress];

            let result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            dbLogger.log(`Model-Handling-Error: Failed to Access and Update robot entity status\n`, err.message)
            return null;
        }
    }

    static async deleteRobot(robotAddress) {
        let queryText = RobotQueries.DELETE_ROBOT;
        let values = [robotAddress];
        try {
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            dbLogger.log("Model-Handling-Error: Failed to delete robot entity\n", err.message);
            return null;
        }
    }

    static async getAllRobots() {
        let queryText = RobotQueries.GET_ALL_ROBOTS;
        try {
            const result = await dbConnection.dbQuery(queryText);
            return result;
        } catch (err) {
            dbLogger.log("Model-Handling-Error: Failed to get all robot entities\n", err.message);
            return null;
        }
    }

    static async deleteAllRobots() {
        let queryText = RobotQueries.DELETE_ALL_ROBOTS;
        try {
            const result = await dbConnection.dbQuery(queryText);
            return result;
        } catch (err) {
            dbLogger.log("Model-Handling-Error: Failed to delete all robot entities\n", err.message);
            return null;
        }
    }

    static async getRobotJobs(robotAddress){//Changed
        try {
            let robot = await this.getRobotByAddress(robotAddress)
            if(robot){
                let queryText = JobQueries.GET_ROBOT_JOBS;
                let values = [robot.id]
                const result = await dbConnection.dbQuery(queryText, values);
                if (result)
                    return result;
                dbLogger.log("\nModel-Handling: No Scheduled Jobs exist")
                return null;
            }
            throw new Error(`Model-Handling-Error: Robot doesn't exist to fetch its jobs`)
        } catch (err) {
            dbLogger.log("Model-Handling-Error: Failed to get Job entity\n", err.message);
            return null;
        }
    }
}

module.exports = Robot;
