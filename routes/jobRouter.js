const express = require('express')
const router = express.Router()
const jobController = require('../controllers/jobController');
const jobApiHandler = require('../endpoints/handlers/jobApiHandler')

module.exports = () => {
    router.get('/force/:jobID', jobController.ForceJob)
    router.get('/cancel/:jobID', jobController.CancelJob)

    router.get('/api/get/id/:jobID', jobApiHandler.getJobByID)
    router.get('/api/get/user/', jobApiHandler.getUserJobs)
    router.get('/api/get/robot/:robotID', jobApiHandler.getRobotJobs)
    router.get('/api/get/', jobApiHandler.getJobMetrics)

    return router
}
