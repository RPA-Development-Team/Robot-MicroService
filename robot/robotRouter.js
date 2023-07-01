const express = require('express');
const router = express.Router();
const robotController = require('./robotController');

router.get('/', express.static('index.html') );
router.post('/pkg', robotController.receivePackage);
router.get('/robots/:name', robotController.handleRobotLogs);
router.get('/jobs/force/:jobID', robotController.ForceJob)
router.get('/jobs/cancel/:jobID', robotController.CancelJob)

module.exports = router;