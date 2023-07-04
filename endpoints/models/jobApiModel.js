class JobApiModel {
    constructor(prisma) {
        this.prisma = prisma
    }

    async GetAllJobs() {
        try {
            const jobs = await this.prisma.Job.findMany()
            if (!jobs) {
                console.log(`No Jobs yet found`)
                return null
            }
            return jobs
        } catch (err) {
            console.log(`[Model-Handling-Error]: Failed to get all jobs`)
            console.log(`Error: ${err.message}`)
            throw new Error(`Failed to get all jobs`)
        }
    }

    async GetJobByID(jobID) {
        try {
            const job = await this.prisma.Job.findUnique({
                where: { id: jobID }
            })
            if (!job) {
                console.log(`No Such Job found`)
                return null
            }
            return job
        } catch (err) {
            console.log(`Error: ${err.message}`)
            throw new Error(`[Model-Handling-Error]: Failed to get job entity with job-id`)
        }
    }

    async GetUserJobs(userID) {
        try {
            const jobs = await this.prisma.Job.findMany({
                where: { userID: userID }
            })
            if (!jobs) {
                console.log(`No Jobs belongs to this user`)
                return null
            }
            return jobs
        } catch (err) {
            console.log(`Error: ${err.message}`)
            throw new Error(`[Model-Handling-Error]: Failed to get job entities with user-id`)
        }
    }

    async GetRoobtJobs(robotID) {
        try {
            const job = await this.prisma.Job.findMany({
                where: { robotID: robotID }
            })
            if (!job) {
                console.log(`No Jobs currently belongs to this robot`)
                return null
            }
            return job
        } catch (err) {
            console.log(`Error: ${err.message}`)
            throw new Error(`[Model-Handling-Error]: Failed to get connected job entities with robot-id`)
        }
    }

    async GetRobotPendingJobs(robotID) {
        try {
            const jobs = await this.prisma.Job.findMany({
                where: { 
                    robotID: robotID, 
                    status: 'Pending' 
                }
            })
            if (!jobs) {
                console.log(`No Current Pending Jobs for this robot`)
                return null
            }
            return jobs
        } catch (err) {
            console.log(`Error: ${err.message}`)
            throw new Error(`[Model-Handling-Error]: Failed to get pending job entities for robot`)
        }
    }

    async GetRobotExecutedJobs(robotID) {
        try {
            const jobs = await this.prisma.Job.findMany({
                where: { 
                    robotID: robotID, 
                    status: 'Executed' 
                }
            })
            if (!jobs) {
                console.log(`No Current Executed Jobs for this robot`)
                return null
            }
            return jobs
        } catch (err) {
            console.log(`Error: ${err.message}`)
            throw new Error(`[Model-Handling-Error]: Failed to get executed job entities for robot`)
        }
    }

    async GetUserPendingJobs(userID) {
        try {
            const jobs = await this.prisma.Job.findMany({
                where: { 
                    userID: userID, 
                    status: 'Pending' 
                }
            })
            if (!jobs) {
                console.log(`No Current Pending Jobs for this user`)
                return null
            }
            return jobs
        } catch (err) {
            console.log(`Error: ${err.message}`)
            throw new Error(`[Model-Handling-Error]: Failed to get pending job entities for user`)
        }
    }

    async GetUserExecutedJobs(userID) {
        try {
            const jobs = await this.prisma.Job.findMany({
                where: { 
                    userID: userID, 
                    status: 'Executed' 
                }
            })
            if (!jobs) {
                console.log(`No Current Executed Jobs for this user`)
                return null
            }
            return jobs
        } catch (err) {
            console.log(`Error: ${err.message}`)
            throw new Error(`[Model-Handling-Error]: Failed to get executed job entities for user`)
        }
    }

    async GetUserFailedJobs(userID) {
        try {
            const jobs = await this.prisma.Job.findMany({
                where: { 
                    userID: userID, 
                    status: 'Failed' 
                }
            })
            if (!jobs) {
                console.log(`No Current Failed Jobs for this user`)
                return null
            }
            return jobs
        } catch (err) {
            console.log(`Error: ${err.message}`)
            throw new Error(`[Model-Handling-Error]: Failed to get executed job entities for user`)
        }
    }

    async GetUserCancelledJobs(userID) {
        try {
            const jobs = await this.prisma.Job.findMany({
                where: { 
                    userID: userID, 
                    status: 'Cancelled' 
                }
            })
            if (!jobs) {
                console.log(`No Current Cancelled Jobs for this user`)
                return null
            }
            return jobs
        } catch (err) {
            console.log(`Error: ${err.message}`)
            throw new Error(`[Model-Handling-Error]: Failed to get executed job entities for user`)
        }
    }
}

module.exports = JobApiModel
