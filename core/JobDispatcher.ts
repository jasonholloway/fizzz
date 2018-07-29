import JobQueue from "./JobQueue";
import Job from "./Job";
import Flow from "./Flow";
import Context from "./Context";
import Start from "./Start";
import Stream from "./Stream";
import { loadData, saveData } from './data'
import FlowImpl from "./FlowImpl";
import FlowState from "./FlowState";

class JobDispatcher {
    jobs: JobQueue;

    constructor(jobs: JobQueue) {
        this.jobs = jobs;
    }

    pump() {
        console.debug('PumpStarted');
        return this.jobs.next()
                .flatMap(j => this.performJob(j))
    }


    performJob(job: Job): Stream<any> {
        console.debug('Performing', job);
        return loadData<FlowState>(job.stateKey)
                .flatMap(s => {
                    console.debug('FlowStateLoaded', s);
                    
                    const flow = loadFlow(s.defPath);
    
                    return flow.runStage(s, createContext())
                                .tap(s => console.debug('StageCompleted', s))
                                .through(saveData(job.stateKey))
                                .head()
                                .flatMap(k => this.jobs.enqueue({ stateKey: k }));
                });            
    }
    


}






type FlowCreator = (start: Start) => Flow<any>

function loadFlow(path: string): FlowImpl<any, any> {
    const createFlow = require(path).default as FlowCreator;
    console.debug('FlowDefLoaded', path);

    const start: Start = (fn) => new FlowImpl<any, any>(0, null, fn);
    
    return createFlow(start) as FlowImpl<any, any>;
}

function createContext(): Context {
    return {
        load: (name: string) => loadData(name),
        save: (name: string) => (data: Stream<any>) => saveData(name)(data)
    };
}

/**
 * submitAnswer
 * takes an answer payload relating to a pending interaction
 * and applies it, 
 */
function submitAnswer() {

}




export default JobDispatcher;

