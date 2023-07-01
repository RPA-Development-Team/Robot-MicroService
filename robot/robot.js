const RobotQueries = require('../db/queries').RobotQueryList;
const PackageQueries = require('../db/queries').PackageQueryList;
const JobQueries = require('../db/queries').JobQueryList;


const dbConnection = require('../db/dbConnection');
const { v4: uuidv4 } = require('uuid');
const { JobQueryList } = require('../db/queries');


//Robot model constructor
class Robot {
    static async getRobotBySocketID(socketID) {
        let queryText = RobotQueries.GET_ROBOT_BY_SOCKET_ID;
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
        let queryText = RobotQueries.GET_ROBOT_BY_NAME;
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
        let queryText = RobotQueries.GET_ROBOT_BY_ID;
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
        let queryText = RobotQueries.GET_ROBOT_BY_ADDRESS;
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
        let queryText = RobotQueries.INSERT_ROBOT;
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

            let queryText = RobotQueries.UPDATE_ROBOT_STATUS;
            let values = [updatedAt, connected, socketID, robotAddress];

            let result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            console.log(`Model-Handling-Error: Failed to Access and Update robot entity status\n`, err.message)
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
            console.log("Model-Handling-Error: Failed to delete robot entity\n", err.message);
            return null;
        }
    }

    static async getAllRobots() {
        let queryText = RobotQueries.GET_ALL_ROBOTS;
        try {
            const result = await dbConnection.dbQuery(queryText);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to get all robot entities\n", err.message);
            return null;
        }
    }

    static async deleteAllRobots() {
        let queryText = RobotQueries.DELETE_ALL_ROBOTS;
        try {
            const result = await dbConnection.dbQuery(queryText);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to delete all robot entities\n", err.message);
            return null;
        }
    }
    
    static async getPreScheduledPackages() {
        let queryText = PackageQueries.GET_PRESCHEDULED_PACKAGES
        try {
            const result = await dbConnection.dbQuery(queryText);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to return list of pre-scheduled packages from database\n", err.message);
            return null;
        }
    }

    static async saveScheduledPackage(packageName, scheduledDate, scheduledTime) {
        let queryText = PackageQueries.SAVE_SCHEDULED_PACKAGE
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
        let queryText = PackageQueries.REMOVE_SCHEDULED_PACKAGE
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
        let queryText = PackageQueries.GET_PACKAGE_BY_NAME
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
        let queryText = PackageQueries.GET_PACKAGE_BY_ID
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
            let status = 'Pending'

            let queryText = JobQueries.REGISTER_JOB
            let values = [userID, pkg.id, robot.id, date, time, dateReceived, status]
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to save scheduled package at database\n", err.message);
            return null;
        }
    }

    static async GetJobById(jobID) {
        let queryText = JobQueries.GET_JOB_BY_ID;
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
        let queryText = JobQueries.GET_ALL_JOBS;
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
        let queryText = JobQueries.REMOVE_SCHEDULED_JOB
        let values = [jobID]
        try {
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to remove scheduled job from database\n", err.message);
            return null;
        }
    }

    static async updateScheduledJob(jobID, status) {
        let queryText = JobQueries.UPDATE_SCHEDULED_JOB
        let values = [status, jobID]
        try {
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to update scheduled job from database\n", err.message);
            return null;
        }
    }

    static async getRobotJobs(robotAddress){
        let robot = await this.getRobotByAddress(robotAddress)
        let queryText = JobQueries.GET_ROBOT_JOBS;
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