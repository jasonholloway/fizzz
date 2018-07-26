import Flow from "./Flow";
import Context from "./Context";
import StageFn from "./StageFn";
import Start from "./Start";

type FlowInfo = {}
type FlowFactory = (start: Start) => Flow<any>
type FlowState = {
    index: number
}


const flow = loadFlow('../flows/scrapeRestaurants');

runFlow(flow, { index: 0 });



class FlowImpl<Out> implements Flow<Out> {
    then<Next>(fn: StageFn<Out, Next>): Flow<Next> {
        //return new node with new index
        throw new Error("Method not implemented.");
    }

    getStage(index: number): StageFn<any, Out> {
        throw 123;
    }
}


function loadFlow(path: string): FlowImpl<any> {
    const fac = require(path) as FlowFactory;
    const start: Start = null;
    return fac(start) as FlowImpl<any>;
}

function runFlow(flow: FlowImpl<any>, state: FlowState) {

    flow.getStage(state.index)


    /**
     * having loaded the flow and its state via some magical means
     * we now need to execute it
     */


}





export default runFlow;
