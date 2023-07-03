const express = require('express')
const router = express.Router()
const jobRouter = require('./jobRouter')
const robotRouter = require('./robotRouter')

module.exports = () => {
    router.get('/', express.static('index.html') );
    router.use('/robots', robotRouter())
    router.use('/jobs', jobRouter())
    return router
}
