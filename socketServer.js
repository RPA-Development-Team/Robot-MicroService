const http =require('http');
const expressApi = require('./expressApi');
const WebSocket = require("ws")
const sockets = require('./sockets');
const dotenv = require('dotenv');

//load environment variables
dotenv.config();
let port = process.env.PORT;

//creating an http server instance from the expressApi
const httpServer = http.createServer(expressApi);

//Server listening
httpServer.listen(port, () => {
    console.log(`Server Connected on port ${port}...`);
});

//Binding socket-server to http-server
const socketServer = new WebSocket.Server({server: httpServer})
sockets.reScheduleJobs()
sockets.socketListen(socketServer);


