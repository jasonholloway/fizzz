import JobPump from "../core/JobPump";
import JobQueue from '../core/JobQueue'
import globalTunnel from 'global-tunnel-ng'

globalTunnel.initialize({
    host: '127.0.0.1',
    port: 3128
});

const jobs = new JobQueue();

const runner = new JobPump(jobs);

runner.pump()
    .tap(info => console.debug('JobDone', info))
    .errors(err => console.error('ERROR!!!', err))
    .done(() => process.exit());
    

