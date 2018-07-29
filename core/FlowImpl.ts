import StageFn from "./StageFn";
import Context from "./Context";
import Stream from "./Stream";
import Flow from "./Flow";
import FlowState from "./FlowState";
import _ from 'highland'

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

    runStage(state: FlowState, ctx: Context): Stream<FlowState> {
        const { pos, data } = state;
        const stage = this.findStage(pos);
        console.debug('StageFound', stage);

        return (stage(ctx, data) || _())
                .tap(s => console.debug('StageResult', s))
                .collect()
                .tap(s => console.debug('StageResultCollected', s))
                .map(r => ({
                    ...state, 
                    pos: pos + 1,
                    data: r })
                );
    }

    findStage(pos: number): StageFn<any, any> {
        if(this.pos == pos)
            return this.fn;
        else if(this.parent && pos < this.pos)
            return this.parent.findStage(pos);
        else 
            throw 'Bad position requested!';
    }

}

export default FlowImpl;