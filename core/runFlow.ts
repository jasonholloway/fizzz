import Flow from "./Flow";
import Context from "./Context";
import Start from "./Start";
import Stream from "./Stream";
import { loadData, saveData } from './data'
import FlowImpl from "./FlowImpl";
import FlowState from "./FlowState";

type FlowCreator = (start: Start) => Flow<any>

// const key = 'flowState0';
// const flow = loadFlow('../flows/scrapeRestaurants');

// runFlow(flow, { key, pos: 0 })
//     .through(saveData(key))
//     .stopOnError(e => console.error(e))
//     .pipe(process.stderr);


function loadFlow(path: string): FlowImpl<any, any> {
    const createFlow = require(path).default as FlowCreator;

    const start: Start = (fn) => new FlowImpl<any, any>(0, null, fn);
    
    return createFlow(start) as FlowImpl<any, any>;
}

function runFlow(flow: FlowImpl<any, any>, state: FlowState) {
    const ctx = createContext();
    return flow.runStage(state, ctx)
            .head();
}

function createContext(): Context {
    return {
        load: (name: string) => loadData(name),
        save: (name: string) => (data: Stream<any>) => saveData(name)(data)
    };
}

export default runFlow;
