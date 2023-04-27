const cron = require('node-cron');
const event = require('./eventEmitter');
const fs = require('fs');
let pkgFolderPath = '././packages';

//Function executed at scheduled date and time
async function sendNotification(pkgFilePath){ 
    console.log(`\n[Scheduler] => Scheduler sending notification to server\n`);

    event.emit('notification', pkgFilePath);
}

//Helper function to save packages locally
function savePackages(pkgMetaData){
    return new Promise((resolve, reject) => {
        let pkgFilePath = `${pkgFolderPath}/${pkgMetaData.package_name}`;
        //No two packages will have the same name
        fs.writeFile(pkgFilePath, `${JSON.stringify(pkgMetaData)}`, function(err) {
            if(err) {
                reject(err);
            }
            resolve(pkgFilePath);
        });
    })
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
        await savePackages(pkgMetaData)
        .then((pkgFilePath) => {
            const formattedDateTime = cronDateTimeFormatter(pkgMetaData.date, pkgMetaData.time);
            console.log(`\n[Scheduler] => Scheduling task to run at [${formattedDateTime}]\n`);
                
            //send date and time to cron-schedule
            const task = cron.schedule(formattedDateTime, async() => {
                await sendNotification(pkgFilePath);
                event.emit('JOB COMPLETED');
            });
        })
        .catch((err) => {
            console.log(`\n[Scheduler] => Error while saving package`);
    })
}

// Listen to when a 'JOB COMPLETED' event is emitted and stop the task
event.on('JOB COMPLETED', () => {
    console.log('\n[Scheduler] => Job done!');
    task.stop();
});
