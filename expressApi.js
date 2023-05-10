const express = require('express');
const expressApi = express();
const morgan = require('morgan');
const path = require('path');
const robotRouter = require('./robot/robotRouter');

//Handling static files
expressApi.use(express.static(path.join(__dirname, "public")));

//Handling middelwares
expressApi.use(morgan("dev"));
expressApi.use(express.json());
expressApi.use(express.urlencoded({ extended: true }));

//Route handler
expressApi.use(robotRouter);

//Exporting expressApi to be linked to the socket-Server
module.exports = expressApi;