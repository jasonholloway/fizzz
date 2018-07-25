import leven from 'leven'
import MapReduceCombine from "../core/MapReduceCombine"
import Stream from "../core/Stream"

type NameId = { name: string, id: number }
type Score = { n1: string, n2: string, s: number }

class TopSimilarites implements MapReduceCombine<any, NameId, Score[]> {
    
    map(els: Stream<any>): Stream<NameId> {
        return els
            .filter(a => typeof a.title !== 'string')
            .map(a => ({
                id: 13,
                name: a.title
            }));
    }

    reduce(bs: Stream<NameId>): Stream<Score[]> {
        return bs
            .collect()
            .map(r => {
                const o: Score[] = [];

                for(let i = 0; i < r.length; i++) {
                    for(let j = i + 1; j < r.length; j++) {
                        const n1 = r[i].name;
                        const n2 = r[j].name;
                        const s = leven(n1, n2);
                        o.push({ n1, n2, s });
                    }
                }

                return o.sort((a, b) => b.s - a.s).reverse();
            });
    }

    combine(a: Score[], b: Score[]): Score[] {
        throw 'would dedupe here and sort...';
    }
}

export default TopSimilarites;
