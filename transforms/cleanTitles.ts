import Transform from '../core/Transform'
import Stream from '../core/Stream'

const re = /^(.*)(?: Restaurant Manchester)(?: Manchester)/i;

class CleanTitles implements Transform<any, any, any> {

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

export default () => new CleanTitles();