import Transform from "../core/Transform";
import Stream from "../core/Stream";

const re = /^Tel: (0[0-9 ]{10,13})/;

class CleanPhone implements Transform<any, any, any> {
    map(els: Stream<any>): Stream<any> {
        return els
            .filter(a => typeof a.phone !== 'string')
            .doto(a => {
                const res = re.exec(a.phone);
                a.phone = res[1].trim();
            });
    }

    reduce(bs: Stream<any>): Stream<any> {
        return bs;
    }

    combine(c0: any, c1: any) {
        throw new Error("Method not implemented.");
    }
}

export default () => new CleanPhone();