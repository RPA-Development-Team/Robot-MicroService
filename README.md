# SocketServer MicroService:

    - Listens for connected clients
    - Saves sent clients' robots' Meta-data at database
    - Updates clients' robots upon disconnection or reconnection
    - Receives packages form studio service and schedules their execution
    - Performs package validation
    - Receives package-reception success or failure log messages from robots
    - Resends unsuccessfully sent packages

## Package Meta-Data:

- Package JSON format:
    { packagename, robot_name, robot_address, path, date, time }

    {"package_name":"package-x69-sth","machine_name":"machine-356hts-linux","path":"Desktop/pkgs/pkg1.txt","date":"18-3-6","time":"19:1:0"}

## Robot sending its Meta-Data:

- Robot JSON format:
    { robot_name, robot_address, userID }

    {"robotName": "LAPTOP-TAUNF8FD","robotAddress": "ehgyuergyigf", "userID": 1}

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



