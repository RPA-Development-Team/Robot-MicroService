const express = require('express')
const router = express.Router()
const jobController = require('../controllers/jobController');
const jobApiHandler = require('../endpoints/handlers/jobApiHandler')

module.exports = () => {
    router.get('/force/:jobID', jobController.ForceJob)
    router.get('/cancel/:jobID', jobController.CancelJob)

    router.get('/get/id/:jobID', jobApiHandler.getJobByID)
    router.get('/get/robot/:robotID', jobApiHandler.getRobotJobs)
    router.get('/get/', jobApiHandler.getJobMetrics)
    router.get('/get/all', jobApiHandler.getAllJobs)
    router.delete('/api/delete/:jobID', jobApiHandler.deleteJob)


    return router
}
