const http =require('http');
const expressApi = require('./expressApi');
const io = require('socket.io');
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
const socketServer = io(httpServer);
sockets.socketListen(socketServer);


