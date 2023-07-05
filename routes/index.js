const express = require('express')
const router = express.Router()
const jobRouter = require('./jobRouter')
const robotRouter = require('./robotRouter')
const auth = require('../middleware/auth')
const extractToken = require('../middleware/extractToken')

module.exports = () => {
    router.get('/', express.static('index.html') );
    router.use('/robots', robotRouter())
    router.use('/jobs', jobRouter())
    router.get('/home', getHomeMetrics)
    // router.use('/robots', auth, extractToken, robotRouter())
    // router.use('/jobs', auth, extractToken, jobRouter())
    return router
}

