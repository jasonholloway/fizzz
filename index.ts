
type Primitive = string | number

type Value = Primitive | Clump


type Clump = {                  //a Clump is graph of flattened possibles: an unnested array means sibling possibilities
    [k: string]: Spread<Value>
}

type Slice = {                  //a Slice is a single, simple thin view of Clump
    [k: string]: Primitive | object
}

type Spread<T> = T | T[]

type Partition = {
    clumps: Spread<Clump>[]
}


interface Strategy {
    listen(): boolean
    test(slice: Slice): Projection | false
}

interface Projection {
    run(): Promise<Clump>
}


const clumps = require('./data/manchesterCom.json')
                .concat(require('./data/restsOfManc.json')) as Clump[];


console.info(clumps);


//
//given some clumps
//
//
//


