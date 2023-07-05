const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const JobApiModel = require('../models/jobApiModel')
const jobApiModel = new JobApiModel(prisma)

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
        const jobs = await jobApiModel.getUserJobs(userID)
        const pendingJobs = await jobApiModel.GetUserPendingJobs(userID)
        const executedJobs = await jobApiModel.getUserExecutedJobs(userID)
        const failedJobs = await jobApiModel.GetUserFailedJobs(userID)
        const cancelledJobs = await jobApiModel.GetUserCancelledJobs(userID)

        let response = {
            counters: {
                jobs: length(jobs),
                pending: length(pendingJobs),
                executed: length(executedJobs),
                failed: length(failedJobs),
                cancelled: length(cancelledJobs)
            },
            jobs
        }
        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({Error: err.message})
    }

}

exports.deleteJob = async (req, res) => {
    try {
        const { jobID } = req.params;
        const status = await jobApiModel.DeleteJob(jobID);
        let response = {
            jobID,
            status
        }
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({Error: err.message});
    }
};