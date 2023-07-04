const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const RobotApiModel = require('../models/robotApiModel')
const robotApiModel = new RobotApiModel(prisma)

exports.getAllRobots = async (req, res) => {
    try {
        const robots = await robotApiModel.GetAllRobots()
        if (!robots) {
            return res.status(200).json({ Robots: [] })
        }
        return res.status(200).json({ Robots: robots })
    } catch (err) {
        return res.status(500).json({
            Error: err.message
            , Robots: []
        })
    }
}

exports.getRobotByID = async (req, res) => {
    try {
        const { robotID } = req.params
        const robot = await robotApiModel.GetRobotByID(parseInt(robotID))
        if (!robot) {
            return res.status(200).json({ Robot: [] })
        }
        return res.status(200).json({ Robot: robot })
    } catch (err) {
        return res.status(500).json({
            Error: err.message
            , Robot: []
        })
    }
}

exports.getRobotByAddress = async (req, res) => {
    try {
        const { robotAddress } = req.params;
        const robot = await robotApiModel.GetRobotByAddress(robotAddress);
        if (!robot) {
            return res.status(200).json({ Robot: [] });
        }
        return res.status(200).json({ Robot: robot });
    } catch (err) {
        return res.status(500).json({
            Error: err.message,
            Robot: []
        });
    }
};


exports.getUserRobots = async (req, res) => {
    try {
        const { userID } = req.params
        const robots = await robotApiModel.GetUserRobots(parseInt(userID))
        if (!robots) {
            return res.status(200).json({ Robots: [] })
        }
        return res.status(200).json({ Robots: robots })
    } catch (err) {
        return res.status(500).json({
            Error: err.message
            , Robots: []
        })
    }
}

exports.getAllConnectedRobots = async (req, res) => {
    try {
        const robots = await robotApiModel.GetAllConnectedRobots()
        if (!robots) {
            return res.status(200).json({ Robots: [] })
        }
        return res.status(200).json({ Robots: robots })
    } catch (err) {
        return res.status(500).json({
            Error: err.message
            , Robots: []
        })
    }
}

exports.getUserConnectedRobots = async (req, res) => {
    try {
        const { userID } = req.params
        const robots = await robotApiModel.GetUserConnectedRobots(parseInt(userID))
        if (!robots) {
            return res.status(200).json({ Robots: [] })
        }
        return res.status(200).json({ Robots: robots })
    } catch (err) {
        return res.status(500).json({
            Error: err.message
            , Robots: []
        })
    }
}