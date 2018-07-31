import Stream from "./Stream";
import Key from "./Key";

interface Context {
    load(key: Key): Stream<any>
    save(key: Key): (data: Stream<any>) => Stream<Key>
};

export default Context;
