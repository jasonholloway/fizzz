import StageFn from "./StageFn";
import Flow from "./Flow";

type Start = <Out>(fn: StageFn<void, Out>) => Flow<Out>;

export default Start;