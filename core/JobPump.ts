import JobQueue from "./JobQueue";
import Job from "./Job";
import Flow from "./Flow";
import Context from "./Context";
import Start from "./Start";
import Stream from "./Stream";
import { loadData, saveData } from './data'
import FlowImpl from "./FlowImpl";
import FlowState from "./FlowState";
import Key from "./Key";
import _ from 'highland'

const info = console.info.bind(console);

class JobPump {
    jobs: JobQueue;

    constructor(jobs: JobQueue) {
        this.jobs = jobs;
    }

    pump() {
        info('PumpStarted');
        return this.jobs.next()
                .flatMap(j => this.performJob(j))
    }

    performJob(job: Job): Stream<Key> {
        info('Performing', job);
        return loadData<FlowState>(job.stateKey)
            .flatMap(state => {
                info('FlowStateLoaded', state);
                
                const flow = loadFlow(state.defPath);

                const stage = flow.findStage(state.pos);
                if(!stage) {
                    info('FlowEnded', job.stateKey)
                    return _([]);
                }

                info('StageFound', stage);

                return (stage(createContext(), state.data) || _())
                        .collect()
                        .map(res => ({
                            ...state,
                            pos: state.pos + 1,
                            data: res })
                        )
                        .through(saveData(job.stateKey))
                        .flatMap(k => this.jobs.enqueue({ stateKey: k }).map(v => k));
            });            
    }
    
}




type FlowCreator = (start: Start) => Flow<any>

function loadFlow(path: string): FlowImpl<any, any> {
    const createFlow = require(path).default as FlowCreator;
    info('FlowDefLoaded', path);

    const start: Start = (fn) => new FlowImpl<any, any>(0, null, fn);
    
    return createFlow(start) as FlowImpl<any, any>;
}

function createContext(): Context {
    return {
        load: (key: Key) => loadData(key),
        save: (key: Key) => (data: Stream<any>) => saveData(key)(data)
    };
}

/**
 * submitAnswer
 * takes an answer payload relating to a pending interaction
 * and applies it, 
 */
function submitAnswer() {

}




export default JobPump;

