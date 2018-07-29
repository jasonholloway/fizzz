import Context from "./Context";
import Stream from "./Stream";

interface Question<Data> {}

type StageResult<Data> = void | Stream<Data> | Stream<Question<Data>>

type StageFn<In, Out> = (ctx: Context, scope: Stream<In>) => StageResult<Out>

export default StageFn;
