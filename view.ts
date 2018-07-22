import columnify from 'columnify'
import prettyJson from 'prettyjson'
import clear from 'cli-clear'
import chokidar from 'chokidar'
import _ from 'highland'
import loadJson from 'load-json-file'
import parseArgs from 'minimist'

const args = parseArgs(process.argv.slice(2));
const files = args._;

run().catch(onError);

async function run() {
    const watcher = chokidar.watch(files, {});    
    const rendering = Promise.resolve();

    watcher.on('all', () => {
        rendering
            .then(() => render())
            .catch(onError);
    });
}

async function render() {
    const offset = 0;
    const count = 10;

    const diffs = _(files)
                    .map(loadJsonStream)
                    .zipAll0()
                    .drop(offset).take(count);    

    const cols = await diffs
                    .map(d => d.map(pretty))
                    .collect()
                    .toPromise(Promise);


    clear();
    console.log(columnify(cols, { preserveNewLines: true, columnSplitter: ' | ' }));
}

function onError(err) {
    console.error(err);
    process.exit();
}

function loadJsonStream(path: string): Highland.Stream<any> {
    return _(loadJson(path) as Promise<any[]>).flatten();
}

function pretty(data: any): string {
    return prettyJson.render(data);
}
