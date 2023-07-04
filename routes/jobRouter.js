const express = require('express')
const router = express.Router()
const jobController = require('../controllers/jobController');
const jobApiHandler = require('../endpoints/handlers/jobApiHandler')

module.exports = () => {
    router.get('/force/:jobID', jobController.ForceJob)
    router.get('/cancel/:jobID', jobController.CancelJob)

    router.get('/api/get/id/:jobID', jobApiHandler.getJobByID)
    router.get('/api/get/user/:userID', jobApiHandler.getUserJobs)
    router.get('/api/get/robot/:robotID', jobApiHandler.getRobotJobs)
    router.get('/api/get/pending/user/:userID', jobApiHandler.getUserPendingJobs)
    router.get('/api/get/executed/user/:userID', jobApiHandler.getUserExecutedJobs)
    router.get('/api/get/pending/robot/:robotID', jobApiHandler.getRobotPendingJobs)
    router.get('/api/get/executed/robot/:robotID', jobApiHandler.getRobotExecutedJobs)
    router.get('/api/get/', jobApiHandler.getAllJobs)

    return router
}