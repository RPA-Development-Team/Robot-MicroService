const express = require('express');
const router = express.Router();

router.get('/', express.static('index.html') );

module.exports = router;