const cron = require('node-cron');
const event = require('./eventEmitter');

// Make your callback function asynchronous so that you can use await
async function sendNotification(pkgMetaData, socketId){
    console.log('Executing task for machine: ...'); //------------------
    event.emit('notification', pkgMetaData, socketId);
}

function dateTimeFormatter(date, time){
    date = date.split('-');
    time = time.split(':');
    return ( `${time.reverse().join(" ")} ${date.join(" ")}` );
}

exports.handlePkg = (socketId, pkgMetaData) => {
    console.log(`Pkg received from socket: ${socketId}...`);
    const formattedDateTime = dateTimeFormatter(pkgMetaData.date, pkgMetaData.time);
    console.log(`Scheduling task to run at ${formattedDateTime}`);

    const task = cron.schedule(formattedDateTime, async () => {
        await sendNotification(pkgMetaData, socketId);
        event.emit('JOB COMPLETED');
    });
}

// Listen to when a 'JOB COMPLETED' event is emitted and stop the task
event.on('JOB COMPLETED', () => {
    console.log('Job done!');
    task.stop();
});
