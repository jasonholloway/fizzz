import Stream from './Stream'

interface MapReduceCombine<A, B, C> {
    map(as: Stream<A>): Stream<B>;
    reduce(bs: Stream<B>): Stream<C>;
    combine(c0: C, c1: C): C;
}

export default MapReduceCombine;