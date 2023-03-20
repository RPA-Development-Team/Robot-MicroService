const express = require('express');
const router = express.Router();
const machineController = require('./machineController');

router.get('/', express.static('index.html') );
router.get('/machines', machineController.getMachines);
router.get('/machines/:name', machineController.getMachineLogs);
router.post('/pkg', machineController.getPkg);

module.exports = router;