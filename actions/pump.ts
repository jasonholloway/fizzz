import JobDispatcher from "../core/JobDispatcher";
import JobQueue from '../core/JobQueue'

const jobs = new JobQueue();

const runner = new JobDispatcher(jobs);

runner.pump()
    .tap(info => console.debug('JobDone', info))
    .errors(err => console.error('ERROR!!!', err))
    .done(() => process.exit());
    

