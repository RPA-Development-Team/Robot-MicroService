const cron = require('node-cron');
const event = require('./eventEmitter');
const fs = require('fs');
const scheduledTasks = new Map()
let pkgFolderPath = '././packages';

//Helper function to save packages locally
function savePackages(pkgMetaData){
    return new Promise((resolve, reject) => {
        let {Package} = pkgMetaData
        let pkgFilePath = `${pkgFolderPath}/${Package.package_name}`;
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
    // date = date.split('-')
    date = date.split('-').concat(`${new Date().getDay()}`)
    time = time.split(':');
    return ( `${time.reverse().join(" ")} ${date.join(" ")}` );
}

//Main package handling function
async function handlePkg(pkgMetaData, job) {
    console.log(`\n[Scheduler] => Package received at scheduler from studio-service`);
        //save package locally
        await savePackages(pkgMetaData)
        .then((pkgFilePath) => {
            const formattedDateTime = cronDateTimeFormatter(job.date, job.time);
            console.log(`\n[Scheduler] => Scheduling task to run at [${formattedDateTime}]\n`);
                
            //send date and time to cron-schedule
            const task = cron.schedule(formattedDateTime, () => {
                console.log(`\n[Scheduler] => Scheduler sending notification to server\n`);
                event.emit('notification', pkgFilePath, task);
            });
            scheduledTasks.set(job.id, task)
            console.log(`Mapped Task to jobID: ${job.id}`)
        })
        .catch((err) => {
            console.log(`\n[Scheduler] => Error while saving package`);
    })
}

// Listen to when a 'JOB COMPLETED' event is emitted and stop the task
event.on('JOB COMPLETED', async(task) => {
    console.log('\n[Scheduler] => Job done!');
    task.stop();
});

module.exports = {
    handlePkg,
    scheduledTasks
}
