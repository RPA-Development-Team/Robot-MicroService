const http =require('http');
const express = require('express');
const expressApi = express();
const morgan = require('morgan');
const robotRouter = require('../robot/robotRouter');
const WebSocket = require("ws")
const sockets = require('../sockets/SocketHandler');
const path = require('path');
const dotenv = require('dotenv');

//load environment variables
dotenv.config();
let port = process.env.PORT;

//Handling static files which utilizes the socket-client to be used for testing
expressApi.use(express.static(path.join(__dirname, "public")));

//Handling middelwares
expressApi.use(morgan("dev"));
expressApi.use(express.json());
expressApi.use(express.urlencoded({ extended: true }));

//Route handler
expressApi.use(robotRouter);

//creating an http server instance from the expressApi
const httpServer = http.createServer(expressApi);

//Server listening
httpServer.listen(port, () => {
    console.log(`Server Connected on port ${port}...`);
});

//Binding socket-server to http-server
const socketServer = new WebSocket.Server({server: httpServer})
sockets.ServerInit()
sockets.socketListen(socketServer);


