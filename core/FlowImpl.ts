import StageFn from "./StageFn";
import Flow from "./Flow";

class FlowImpl<In, Out> implements Flow<Out> {
    pos: number
    parent: FlowImpl<any, In>
    fn: StageFn<In, Out>

    constructor(pos: number, parent: FlowImpl<any, In>, fn: StageFn<In, Out>) {
        this.pos = pos;
        this.parent = parent;
        this.fn = fn;
    }

    then<Next>(fn: StageFn<Out, Next>): Flow<Next> {
        return new FlowImpl(this.pos + 1, this, fn);
    }

    findStage(pos: number): false | StageFn<any, any> {
        if(this.pos == pos)
            return this.fn;
        else if(this.parent && pos < this.pos)
            return this.parent.findStage(pos);
        else 
            return false;
    }

}

export default FlowImpl;