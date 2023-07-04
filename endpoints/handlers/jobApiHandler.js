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

exports.getUserJobs = async (req, res) => {
    try {
        const { userID } = req.params
        const jobs = await jobApiModel.GetUserJobs(parseInt(userID))
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

exports.getUserPendingJobs = async (req, res) => {
    try {
        const { userID } = req.params
        const jobs = await jobApiModel.GetUserPendingJobs(parseInt(userID))
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

exports.getUserExecutedJobs = async (req, res) => {
    try {
        const { userID } = req.params
        const jobs = await jobApiModel.GetUserExecutedJobs(parseInt(userID))
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

exports.getRobotPendingJobs = async (req, res) => {
    try {
        const { robotID } = req.params
        const jobs = await jobApiModel.GetRobotPendingJobs(parseInt(robotID))
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

exports.getRobotExecutedJobs = async (req, res) => {
    try {
        const { robotID } = req.params
        const jobs = await jobApiModel.GetRobotExecutedJobs(parseInt(robotID))
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