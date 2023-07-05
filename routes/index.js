const express = require('express')
const router = express.Router()
const jobRouter = require('./jobRouter')
const robotRouter = require('./robotRouter')
const auth = require('../middleware/auth')
const extractToken = require('../middleware/extractToken')
const jobApiHandler = require('../endpoints/handlers/jobApiHandler')

module.exports = () => {
    router.get('/', express.static('index.html') );
    router.use('/robots', auth, extractToken, robotRouter())
    router.use('/jobs', auth, extractToken, jobRouter())
    router.get('/home', auth, extractToken, jobApiHandler.getHomeMetrics)

    return router
}

