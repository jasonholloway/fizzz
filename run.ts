import js from 'jsonstream'
import fs, { PathLike } from 'fs'
import _ from 'highland'
import Stream from './core/Stream'
import Transform from './core/Transform'
import parseArgs from 'minimist'

const args = parseArgs(process.argv.slice(2));
const inputs: string[] = Array.isArray(args.i)
                                        ? args.i : [args.i];
const transformFile: string = args.t;
const output: string = args.o;


const transform = loadTransform(transformFile);
console.log(transform);

loadData(inputs)
    .through(transform.map)
    .through(transform.reduce)      
    //and now combine...
    .through(js.stringify())
    .stopOnError(onError)
    .pipe(saveData(output));

function loadTransform(file: string): Transform<any, any, any> {
    return require(file).default();
}

function loadData(inputs: string[]): Stream<any> {
    return _(inputs).flatMap(i => loadFile(`./data/${i}/data.json`));
}

function loadFile(file: PathLike) {
    return _(fs.createReadStream(file))
            .through(js.parse('*'));
}

function saveData(output: string) {
    fs.mkdirSync(`./data/${output}`);

    const str = _();

    str.through(js.stringify())
        .pipe(fs.createWriteStream(`./data/${output}/data.json`));

    return str;
}

function onError(err: Error) {
    console.error(err);
    process.exit();
}
