# SocketServer MicroService

    - Listens for connected clients
    - Using websocket with manually created IDs mapped to sockets
    - Saves sent clients' robots' Meta-data at database
    - Updates clients' robots upon disconnection or reconnection
    - Receives job triggers to schedule robot package execution
    - Create job instances and handle their status
    - Reschedules job execution at server restart
    - Performs package validation
    - Stores daily server logs in seperate log files
    - Receives package-reception success or failure log messages from robots
    - Resends unsuccessfully sent packages

## Installation
    npm install
        installs all dependencies
    
    nodemon socketServer.js
        Run socketServer instance

## Running dockerized container
    - Build image
        docker build -t image1 ./
    
    - Building and running a container
        docker run --name c1 -p 4000:4000 -d image1

# Server execution Flow
## 1- Initializing connection to Robot 
    Clients connect to server defined address using websocket.
    Each client robot sends its own metadata.
    All server logs are saved locally in the serverLogs directory.

Robot Meta-data format

```javascript
// USE THE SAME NAMING CONVENTION
// robotName is the robot pysical machine name
// robotAddress is its mac-address to be used as unique identifier
// userID is the id of the user the robot gets after authentication
{
    "robotName": "LAPTOP-TAUNF8FD",
    "robotAddress": "001AFFDB45C2",
    "userID": 4
}
```
## 2- Job triggering
    At job triggering, information regarding robot, package and their schedule must be stated.
    The package is validated for any missing data, then saved locally in the packages Directory.
    New job instance is created and scheduled for the provided date and time.

Trigger Json format

```javascript
{
    "Package": {
        "package_name": "package-x74s-eg",
        "path": "cloudinary/studioPackages/pkg1-x74s.std"
    },
    "Robot": {
        "robot_name": "LAPTOP-TAUNF8FD",
        "robot_address": "001AFFDB45C2"
    },
    "Schedule": {
        "date": "15-7",
        "time": "9:00:00"
    }
}
```
## 3- Sending scheduled package to robot
    At the defined schedule, the job instance would be executed and the package would be sent to the defined robot.
     
Package Json format

```javascript
//Data sent to robot at schedule
data = {
    event: "notification",
    value: Package
}

//Package details included
Package = { 
    package_name: "package-x74s-eg",
    path: "cloudinary/studioPackages/pkg1-x74s.std"
}
```
## 4- Cancelling execution of scheduled job
    Send Get Request with the job-id as a query paramter
    
    GET     http://serverAddress:port/jobs/cancel/_jobID_/

## 5- Forcing execution of scheduled job 
    Send Get Request with the job-id as a query paramter
        
    GET     http://serverAddress:port/jobs/force/_jobID_/

## 6- Handling connection success/failure log messages
    Receiving success and failure message from robot indicating the status of sent package.

```javascript
//Client Robot using websocket to send message to server
const data = {
    event: 'client robot message',
    value: 'Message sent by Robot indicating success or failure'
}
socket.send(JSON.stringify(data));
```