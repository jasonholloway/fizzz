import Stream from "./Stream";

type Key = string;

interface Context {
    load(name: string): Stream<any>
    save(name: string): (data: Stream<any>) => Stream<Key>
};

export default Context;
