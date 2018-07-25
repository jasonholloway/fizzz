import loadJson from 'load-json-file'
import _ from 'highland'
import js from 'jsonstream'

type Primitive = string | number

type Value = Primitive | Clump


type Clump = {                  //a Clump is graph of flattened possibles: an unnested array means sibling possibilities
    [k: string]: Spread<Value>
}

type Slice = {                  //a Slice is a single, simple thin view of Clump
    [k: string]: Primitive | {}
}

type Spread<T> = T | T[]

type Partition = {
    clumps: Spread<Clump>[]
}

interface Strategy {
    run(slice: Slice): Promise<false | Clump>
}



interface Rand {
    bool(): boolean,
    int(): number,
    pick<C>(cs: C[]): C
}


interface Context {
    clumps: Clump[]
    rand: Rand
}

function testStrategy(): Strategy {
    let i = 20;

    return {
        async run(slice: Slice): Promise<false | Clump> {     
            if(typeof slice.phone !== 'string') return false;
            else {
                const res = /^Tel: (0[0-9 ]{10,13})/.exec(slice.phone);
                slice.phone = res[1].trim()
                return slice;
            }
        }
    }
}


run(testStrategy()).catch(onError);

async function run(strategy: Strategy) {
    _(process.stdin.pipe(js.parse('*')))
        .take(10)
        .flatMap(
            (c: Slice) => _(strategy.run(c))
                            .map(res => res === false ? c : res)
                            .errors((err, push) => {
                                console.error(err);
                                push(null, c);
                            })
        )
        .stopOnError(_.log)
        .pipe(js.stringify())
        .pipe(process.stdout);
}


async function createContext(): Promise<Context> {
    return {
        clumps: await loadData(),
        rand: createRand()
    };
}

function createRand(): Rand {
    return {
        bool() { return Math.random() > 0 },
        int() { return Math.random() },
        pick<C>(cs: C[]): C {
            return null;
        }
    };
}


async function loadData() {
    const data1 = await loadJson('data/mancCom-200718.json') as Clump[];    //how nice it'd be to validate this typing
    const data2 = await loadJson('data/restsOfManc-200718.json') as Clump[];
    return data1.concat(data2);
}


/**
 * Crawls into the data, selects a strategy 
 * BuT! how will the strategy be selected? Plus, the further selecting of 
 * */
function *drive(ctx: Context) {
    while(true) yield ctx;
}



function onError(err: Error) {
    console.error(err);
    process.exit();
}
