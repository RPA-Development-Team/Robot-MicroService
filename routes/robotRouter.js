const express = require('express');
const router = express.Router();
const robotController = require('../controllers/robotController');
const robotApiHandler = require('../endpoints/handlers/robotApiHandler')

module.exports = () => {
    router.post('/package', robotController.receivePackage);
    router.get('/:name', robotController.handleRobotLogs);

    router.get('/api/get/id/:robotID', robotApiHandler.getRobotByID)
    router.get('/api/get/address/:robotAdress', robotApiHandler.getRobotByAddress)
    router.get('/api/get/', robotApiHandler.getUserRobots)
    router.get('/api/get/all/connected', robotApiHandler.getAllConnectedRobots)
    router.get('/api/get/all', robotApiHandler.getAllRobots)
    

    return router
}