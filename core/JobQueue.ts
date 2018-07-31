import Stream from "./Stream";
import _ from 'highland'
import Job from "./Job";
import { Queue } from 'file-queue'

class JobQueue {

    queue: Queue;

    private popped: Stream<Job>;
    private push: (Job) => Stream<void>

    constructor() {
        const self = this;

        this.queue = new Queue('../data/jobs', e => { if (e) console.error(e); });
        this.push = _.wrapCallback(this.queue.push.bind(this.queue));

        this.popped = _((push, next) => {
            console.debug('JobListening');
            self.queue.pop((err, job) => {
                if(err) return push(err);

                console.debug('JobPopped', job);
                push(null, job);
                next();
            });
        });
    }

    enqueue(job: Job): Stream<void> {
        return this.push(job)
                .tap(j => console.debug('JobQueued', job));
    }

    next(): Stream<Job> {
        const forked = this.popped.fork();

        forked.observe().done(() => console.debug('ploplopplop'))

        return forked;
    }
}

export default JobQueue;
