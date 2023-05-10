const express = require('express');
const router = express.Router();
const robotController = require('./robotController');

router.get('/', express.static('index.html') );
router.get('/robots', robotController.getRobots);
router.get('/robots/:name', robotController.getRobotLogs);
router.post('/pkg', robotController.getPkg);

module.exports = router;