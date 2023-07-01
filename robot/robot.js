const robotQueries = require('../db/queries').robotQueryList;
const dbConnection = require('../db/dbConnection');
const { v4: uuidv4 } = require('uuid');


//Robot model constructor
class Robot {
    static async getRobotBySocketID(socketID) {
        let queryText = robotQueries.GET_ROBOT_BY_SOCKET_ID;
        let values = [socketID];
        try {
            const [result] = await dbConnection.dbQuery(queryText, values);
            if (result)
                return result;
            console.log("\nModel-Handling: Robot doesn't exist")
            return null;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to get robot entity\n", err.message);
            return null;
        }
    }

    static async getRobotByName(name) {
        let queryText = robotQueries.GET_ROBOT_BY_NAME;
        let values = [name];
        try {
            const [result] = await dbConnection.dbQuery(queryText, values);
            if (result)
                return result;
            console.log("\nModel-Handling: Robot doesn't exist")
            return null;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to get robot entity\n", err.message);
            return null;
        }
    }

    static async getRobotById(id) {
        let queryText = robotQueries.GET_ROBOT_BY_ID;
        let values = [id];
        try {
            const [result] = await dbConnection.dbQuery(queryText, values);
            if (result)
                return result;
            console.log("\nModel-Handling: Robot doesn't exist")
            return null;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to get robot entity\n", err.message);
            return null;
        }
    }

    static async getRobotByAddress(robotAddress) {
        let queryText = robotQueries.GET_ROBOT_BY_ADDRESS;
        let values = [robotAddress];
        try {
            const [result] = await dbConnection.dbQuery(queryText, values);
            if (result)
                return result;
            console.log("\nModel-Handling: Robot doesn't exist")
            return null;
        } catch (err) {
            console.log("Model-Handling-Error: Robot exists but Failed to get robot entity\n", err.message);
            return null;
        }
    }

    static async registerRobot(metaData, socketID) {
        let queryText = robotQueries.INSERT_ROBOT;
        let { robotName, robotAddress, userID } = metaData
        let updatedAt = new Date().toLocaleString()
        let values = [updatedAt, robotName, robotAddress, socketID, userID];
        try {
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to Register a new Robot entity\n", err.message);
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

            let result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            console.log(`Model-Handling-Error: Failed to Access and Update robot entity status\n`, err.message)
            return null;
        }
    }

    static async deleteRobot(robotAddress) {
        let queryText = robotQueries.DELETE_ROBOT;
        let values = [robotAddress];
        try {
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to delete robot entity\n", err.message);
            return null;
        }
    }

    static async getAllRobots() {
        let queryText = robotQueries.GET_ALL_ROBOTS;
        try {
            const result = await dbConnection.dbQuery(queryText);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to get all robot entities\n", err.message);
            return null;
        }
    }

    static async deleteAllRobots() {
        let queryText = robotQueries.DELETE_ALL_ROBOTS;
        try {
            const result = await dbConnection.dbQuery(queryText);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to delete all robot entities\n", err.message);
            return null;
        }
    }
    
    static async getPreScheduledPackages() {
        let queryText = robotQueries.GET_PRESCHEDULED_PACKAGES
        try {
            const result = await dbConnection.dbQuery(queryText);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to return list of pre-scheduled packages from database\n", err.message);
            return null;
        }
    }

    static async saveScheduledPackage(packageName, scheduledDate, scheduledTime) {
        let queryText = robotQueries.SAVE_SCHEDULED_PACKAGE
        let values = [packageName, scheduledDate, scheduledTime]
        try {
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to save scheduled package at database\n", err.message);
            return null;
        }
    }

    static async removeScheduledPackage(packageName) {
        let queryText = robotQueries.REMOVE_SCHEDULED_PACKAGE
        let values = [packageName]
        try {
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to remove scheduled package from database\n", err.message);
            return null;
        }
    }

    static async getPackageByName(packageName) {
        let queryText = robotQueries.GET_PACKAGE_BY_NAME
        let values = [packageName]
        try {
            const result = await dbConnection.dbQuery(queryText, values);
            return result[0];
        } catch (err) {
            console.log("Model-Handling-Error: Failed to get package from database\n", err.message);
            return null;
        }
    }

    static async getPackageById(packageID) {
        let queryText = robotQueries.GET_PACKAGE_BY_ID
        let values = [packageID]
        try {
            const result = await dbConnection.dbQuery(queryText, values);
            return result[0];
        } catch (err) {
            console.log("Model-Handling-Error: Failed to get package from database\n", err.message);
            return null;
        }
    }

    static async RegisterJob({ Package, Robot, Schedule }) {
        try {
            let { package_name } = Package
            let { robot_address } = Robot
            let { date, time } = Schedule

            const pkg = await this.getPackageByName(package_name)
            const robot = await this.getRobotByAddress(robot_address)

            let userID = 4 //To be modified
            let dateReceived = new Date().toISOString();
            let status = 'Active'

            let queryText = robotQueries.REGISTER_JOB
            let values = [userID, pkg.id, robot.id, date, time, dateReceived, status]
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to save scheduled package at database\n", err.message);
            return null;
        }
    }

    static async GetJobById(jobID) {
        let queryText = robotQueries.GET_JOB_BY_ID;
        let values = [jobID];
        try {
            const [result] = await dbConnection.dbQuery(queryText, values);
            if (result)
                return result;
            console.log("\nModel-Handling: Job doesn't exist")
            return null;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to get Job entity\n", err.message);
            return null;
        }
    }

    static async GetScheduledJobs(){
        let queryText = robotQueries.GET_ALL_JOBS;
        try {
            const [result] = await dbConnection.dbQuery(queryText);
            if (result)
                return result;
            console.log("\nModel-Handling: No Scheduled Jobs exist")
            return null;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to get Job entity\n", err.message);
            return null;
        }
    }

    static async removeScheduledJob(jobID) {
        let queryText = robotQueries.REMOVE_SCHEDULED_JOB
        let values = [jobID]
        try {
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to remove scheduled job from database\n", err.message);
            return null;
        }
    }

    static async getRobotJobs(robotAddress){
        let robot = await this.getRobotByAddress(robotAddress)
        let queryText = robotQueries.GET_ROBOT_JOBS;
        let values = [robot.id]
        try {
            const result = await dbConnection.dbQuery(queryText, values);
            if (result)
                return result;
            console.log("\nModel-Handling: No Scheduled Jobs exist")
            return null;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to get Job entity\n", err.message);
            return null;
        }
    }
}

module.exports = Robot;