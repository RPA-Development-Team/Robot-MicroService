const express = require('express');
const router = express.Router();
const robotController = require('../controllers/robotController');
const robotApiHandler = require('../endpoints/handlers/robotApiHandler')

module.exports = () => {
    router.post('/package', robotController.receivePackage);
    // router.get('/:name', robotController.handleRobotLogs);

    router.get('/get/id/:robotID', robotApiHandler.getRobotByID)
    router.get('/get/address/:robotAdress', robotApiHandler.getRobotByAddress)
    router.get('/get/', robotApiHandler.getUserRobots)
    router.get('/get/all/connected', robotApiHandler.getAllConnectedRobots)
    router.get('/get/all', robotApiHandler.getAllRobots)
    router.delete('/delete/:robotID', robotApiHandler.deleteRobot)

    return router
}