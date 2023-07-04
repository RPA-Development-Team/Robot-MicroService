const Job = require('../models/job');
const {scheduledTasks} = require('../utils/scheduler')

exports.ForceJob = async (req, res) => {
    try {
        let { jobID } = req.params
        const task = scheduledTasks.get(parseInt(jobID))

        if (task) {
            task._task._execution();
            let job = await Job.updateScheduledJob(jobID, "Executed")
            let context = { Job: jobID, Status: 'Forced to be executed successfully' };
            res.status(200).send(context);
        } else {
            throw new Error(`Job with ID ${jobID} not found`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ Alert: 'Failed to force job' });    }
}

exports.CancelJob = async (req, res) => {
    try {
        let { jobID } = req.params
        const job = await Job.GetJobById(jobID)
        const task = scheduledTasks.get(parseInt(jobID))

        if (job) {
            if(!task){
                console.log(`No associated Task instance found`)
                throw new Error(`Job with ID ${jobID} doesn't have associated cron-task`);            
            }
            task.stop();
            console.log(`Cancelled Task instance successfully`)
            //Instead of Removing Job instance we can change its status to cancelled
            // let result = await Job.removeScheduledJob(jobID)
            let result = await Job.updateScheduledJob(jobID, "Cancelled")
            if(result){
                console.log(`Cancelled Job instance successfully`)
                let context = { Job: jobID, Status: 'Cancelled Job successfully' };
                res.status(200).send(context);
            }else{
                throw new Error(`Job with ID ${jobID} failed to be cancelled`)
            }
        } else {
            throw new Error(`Job with ID ${jobID} not found`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ Alert: 'Failed to cancel job' });    
    }
}
