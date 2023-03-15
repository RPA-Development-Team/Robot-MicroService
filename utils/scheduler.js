const cron = require('node-cron');
const event = require('./eventEmitter');
const fs = require('fs');
let pkgFolderPath = '../packages';

//Function executed at scheduled date and time
function sendNotification(pkgFilePath){ 
    console.log(`\n[Scheduler] => Scheduler sending notification with studio service socketId\n`);
    event.emit('notification', pkgFilePath);
}

//Helper function to save packages locally
function savePackages(){
    let pkgFilePath = `${pkgFolderPath}/${pkgMetaData.name}`;
    fs.writeFile(pkgFilePath, `Details of [${pkgMetaData.name}]: ${JSON.stringify(pkgMetaData)}\n[Date saved]: ${new Date().toISOString()}`, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The package file was saved!");
        return pkgFilePath;
    });
}

//Helper function to format date time to a format required by cron
function cronDateTimeFormatter(date, time){
    date = date.split('-');
    time = time.split(':');
    return ( `${time.reverse().join(" ")} ${date.join(" ")}` );
}

//Main package handling function
exports.handlePkg = async (pkgMetaData) => {
    console.log(`\n[Scheduler] => Package received at scheduler from studio-service`);

    //save package locally
    let pkgFilePath = await savePackages(pkgMetaData);
    if(pkgFilePath){
        const formattedDateTime = cronDateTimeFormatter(pkgMetaData.date, pkgMetaData.time);
        console.log(`\n[Scheduler] => Scheduling task to run at [${formattedDateTime}]\n`);
        
        //send date and time to cron-schedule
        const task = cron.schedule(formattedDateTime, async (pkgFilePath) => {
            await sendNotification(pkgFilePath);
            event.emit('\n[Scheduler] => JOB COMPLETED');
        });
    }
}

// Listen to when a 'JOB COMPLETED' event is emitted and stop the task
event.on('JOB COMPLETED', () => {
    console.log('Job done!');
    task.stop();
});
