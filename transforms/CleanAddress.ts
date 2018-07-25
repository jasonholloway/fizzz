import MapReduceCombine from "../core/MapReduceCombine";
import Stream from "../core/Stream";

const re = /^(.+)[\n\r]\W*map$/m;

class CleanAddress implements MapReduceCombine<any, any, any> {
    map(els: Stream<any>): Stream<any> {
        return els
            .filter(a => typeof a.address !== 'string')
            .filter(a => !re.test(a.address))
            .doto(a => {
                const res = re.exec(a.address);
                a.address = res[1].trim()
            });
    }

    reduce(bs: Stream<any>): Stream<any> {
        return bs;
    }

    combine(c0: any, c1: any) {
        throw new Error("Method not implemented.");
    }
}

export default CleanAddress;