import Context from "./Context";
import Stream from "./Stream";

type StageFn<In, Out> = (ctx: Context, scope: Stream<In>) => void | Stream<Out>

export default StageFn;