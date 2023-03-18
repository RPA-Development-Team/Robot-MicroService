const express = require('express');
const router = express.Router();
const machineController = require('./machineController');

router.get('/', express.static('index.html') );
router.post('/pkg', machineController.getPkg);

module.exports = router;