import MapReduceCombine from '../core/MapReduceCombine'
import Stream from '../core/Stream'

const re = /^(.*)(?: Restaurant Manchester)(?: Manchester)/i;

export default class CleanTitles implements MapReduceCombine<any, any, any> {

    map(els: Stream<any>): Stream<any> {
        return els
            .filter(a => !re.test(a.title))
            .doto(a => {
                a.title = re.exec(a.title)[1];
            });
    }
    
    reduce(bs: Stream<any>): Stream<any> {
        return bs;
    }

    combine(c0: any, c1: any) {
        throw new Error("Method not implemented.");
    }

}
