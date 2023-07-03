const RobotQueries = require('../db/queries').RobotQueryList;
const PackageQueries = require('../db/queries').PackageQueryList;
const JobQueries = require('../db/queries').JobQueryList;
const dbConnection = require('../db/dbConnection');
const RobotModel = require('./robot')

class Job{
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
                const robot = await RobotModel.getRobotByAddress(robot_address)
    
                let userID = 1 //To be modified
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
}

module.exports = Job