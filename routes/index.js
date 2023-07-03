const express = require('express')
const router = express.Router()
const jobRouter = require('./jobRouter')
const robotRouter = require('./robotRouter')

module.exports = () => {
    router.use('/robots', robotRouter())
    router.use('/jobs', jobRouter())
    router.get('/test', express.static('index.html') );

    return router
}