const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const JobApiModel = require('../models/jobApiModel')
const jobApiModel = new JobApiModel(prisma)
const RobotApiModel = require('../models/robotApiModel')
const robotApiModel = new RobotApiModel(prisma)

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await jobApiModel.GetAllJobs()
        if (!jobs) {
            return res.status(200).json({ Jobs: [] })
        }
        return res.status(200).json({ Jobs: jobs })
    } catch (err) {
        return res.status(500).json({
            Error: err.message
            , Jobs: []
        })
    }
}

exports.getJobByID = async (req, res) => {
    try {
        const { jobID } = req.params
        const job = await jobApiModel.GetJobByID(parseInt(jobID))
        if (!job) {
            return res.status(200).json({ Job: [] })
        }
        return res.status(200).json({ Job: job })
    } catch (err) {
        return res.status(500).json({
            Error: err.message
            , Job: []
        })
    }
}

exports.getRobotJobs = async (req, res) => {
    try {
        const { robotID } = req.params
        const jobs = await jobApiModel.GetRoobtJobs(parseInt(robotID))
        if (!jobs) {
            return res.status(200).json({ Jobs: [] })
        }
        return res.status(200).json({ Jobs: jobs })
    } catch (err) {
        return res.status(500).json({
            Error: err.message
            , Jobs: []
        })
    }
}

exports.getJobMetrics = async (req, res) => {
    try {
        const userID = req.userID
        const jobs = await jobApiModel.GetUserJobs(userID)
        const pendingJobs = await jobApiModel.GetUserPendingJobs(userID)
        const executedJobs = await jobApiModel.GetUserExecutedJobs(userID)
        const failedJobs = await jobApiModel.GetUserFailedJobs(userID)
        const cancelledJobs = await jobApiModel.GetUserCancelledJobs(userID)

        const user = await prisma.userAccount.findUnique({
            where: {
                id: userID
            },
            include: {
                packages: true,
                robots: true
            }
        })

        let packages = user.packages,
        robots = user.robots;

        let response = {
            counters: {
                jobs: jobs.length,
                pending: pendingJobs.length,
                executed: executedJobs.length,
                failed: failedJobs.length,
                cancelled: cancelledJobs.length
            },
            jobs,
            packages,
            robots
        }
        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({ Error: err.message })
    }

}

exports.getHomeMetrics = async (req, res) => {
    try {
        const userID = req.userID
        const jobs = await jobApiModel.GetUserJobs(userID)
        const pendingJobs = await jobApiModel.GetUserPendingJobs(userID)
        const executedJobs = await jobApiModel.GetUserExecutedJobs(userID)
        const failedJobs = await jobApiModel.GetUserFailedJobs(userID)
        const cancelledJobs = await jobApiModel.GetUserCancelledJobs(userID)

        const robots = await robotApiModel.GetUserRobots(userID)
        const connectedRobots = await robotApiModel.GetUserConnectedRobots(userID)

        const packages = prisma.package.findMany({
            where: { userID: userID }
        })

        let response = {
            counters: {
                jobs: jobs.length,
                packages: packages.length,
                robots: robots.length
            },
            jobs: {
                total: jobs.length,
                pending: pendingJobs.length,
                executed: executedJobs.length,
                failed: failedJobs.length,
                cancelled: cancelledJobs.length
            },
            robots: {
                connected: connectedRobots.length,
                disconnectedRobots: robots.length - connectedRobots.length
            }
        }
        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({ Error: err.message })
    }
}

exports.deleteJob = async (req, res) => {
    try {
        const { jobID } = req.params;
        const status = await jobApiModel.DeleteJob(parseInt(jobID));
        let response = {
            jobID,
            status
        }
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({ Error: err.message });
    }
};