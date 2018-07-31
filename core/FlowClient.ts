import JobQueue from "./JobQueue";
import { saveData } from "./data";
import _ from 'highland'
import FlowState from "./FlowState";

class FlowClient {
    jobs: JobQueue;

    constructor(jobs: JobQueue) {
        this.jobs = jobs;
    }
    
    async startFlow(id: string, defPath: string): Promise<void> {
        const state: FlowState = { defPath, pos: 0 };
    
        await saveData(`flows/${id}`)(_([state]))
                .flatMap(stateKey => {
                    return this.jobs.enqueue({ stateKey })
                                .map(v => ({ id, stateKey }));
                })
                .toPromise(Promise);
    }
}

export default FlowClient;