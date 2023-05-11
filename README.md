# SocketServer MicroService:

    - Listens for connected clients
    - Saves sent clients' robots' Meta-data at database
    - Updates clients' robots upon disconnection or reconnection
    - Receives packages form studio service and schedules their execution
    - Reschedules package execution at server restart
    - Performs package validation
    - Receives package-reception success or failure log messages from robots
    - Resends unsuccessfully sent packages

## Package Meta-Data:

- Package JSON format:
    { packagename, robot_name, robot_address, path, date, time }

    {
        "package_name":"package-x74s-eg",
        "robot_name":"LAPTOP-TAUNF8FD",
        "robot_address":"ehgyuergyigf",
        "path":"Desktop/pkgs/pkg1.txt",
        "date":"11-5",
        "time":"21:1:0"
    }

## Robot sending its Meta-Data:

- Robot JSON format received from socket clients:
    { robot_name, robot_address, userID }

    {
        "robotName": "LAPTOP-TAUNF8FD",
        "robotAddress": "ehgyuergyigf", 
        "userID": 1
    }

## What you need:
    
    npm install
        installs all dependencies
    
    nodemon socketServer.js
        Run socketServer instance

## Run docker:
    - Build image
        docker build -t image1 ./
    
    - Building and running a container
        docker run --name c1 -p 4000:4000 -d image1



