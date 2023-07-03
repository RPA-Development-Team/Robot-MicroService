const express = require('express')
const router = express.Router()
const jobController = require('../controllers/jobController');

module.exports = () => {
    router.get('/force/:jobID', jobController.ForceJob)
    router.get('/cancel/:jobID', jobController.CancelJob)
    return router
}