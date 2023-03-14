const express = require('express');
const expressApi = express();
const morgan = require('morgan');
const path = require('path');
const machineRouter = require('./machine/machineRouter');

//Handling static files
expressApi.use(express.static(path.join(__dirname, "public")));

//Handling middelwares
expressApi.use(morgan("dev"));
expressApi.use(express.json());
expressApi.use(express.urlencoded({ extended: true }));

//Route handler
expressApi.use(machineRouter);

//Exporting expressApi to be linked to the socket-Server
module.exports = expressApi;