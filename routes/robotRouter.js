const express = require('express');
const router = express.Router();
const robotController = require('../controllers/robotController');

module.exports = () => {
    router.post('/package', robotController.receivePackage);
    router.get('/robots/:name', robotController.handleRobotLogs);

    return router
}