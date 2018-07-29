import Stream from "./Stream";
import _ from 'highland'
import Job from "./Job";
import { Queue } from 'file-queue'

class JobQueue {

    queue: Queue;

    popped: Stream<Job>;

    constructor() {
        const self = this;

        this.queue = new Queue('../data/jobs', e => { if (e) console.error(e); });

        this.popped = _((push, next) => {
            pump();
    
            function pump() {
                self.queue.pop((err, job) => {
                    if(err) return push(err);

                    console.debug('JobPopped', job);
                    push(null, job);
                    next();

                    setImmediate(() => pump());                    
                });
            }
        });
    }

    enqueue(job: Job) {
        console.debug('JobQueued', job);
        return this.queue.push(job, e => { if(e) console.error(e); });
    }

    next(): Stream<Job> {
        return this.popped.fork();
    }
}

export default JobQueue;
