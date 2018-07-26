import StageFn from "./StageFn";

interface Flow<Out> { 
    then<Next>(fn: StageFn<Out, Next>): Flow<Next> 
}

export default Flow;
