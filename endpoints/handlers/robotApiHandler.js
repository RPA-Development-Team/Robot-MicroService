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
        const userID = req.userID
        const robots = await robotApiModel.GetUserRobots(userID)
        const connectedRobots = await robotApiModel.GetUserConnectedRobots(userID)

        let response = {
            counters: {
                robots: robots.length,
                connected: connectedRobots.length,
                disconnectedRobots: robots.length - connectedRobots.length
            },
            robots
        }
        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({Error: err.message})
    }
}

exports.deleteRobot = async (req, res) => {
    try {
        const { robotID } = req.params;
        const status = await robotApiModel.DeleteRobot(parseInt(robotID));
        let response = {
            robotID,
            status
        }
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({Error: err.message});
    }
};