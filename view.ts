import columnify from 'columnify'
import prettyJson from 'prettyjson'
import clear from 'cli-clear'
import chokidar from 'chokidar'
import _ from 'highland'
import loadJson from 'load-json-file'
import parseArgs from 'minimist'

const args = parseArgs(process.argv);
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

    const fileStreams = await _(files)
                                .map(file => _(loadJson(file) as Promise<any[]>))
                                .toPromise(Promise);
        
    const diffs = await fileStreams
                        .take(10)
                        .map(r => ({
                            before: pretty(r[0]),
                            after: pretty(r[1])
                        }))
                        .flatMap(r => _([r, {}]))
                        .collect()      
                        .toPromise(Promise);

    clear();
    console.log(columnify(diffs, { preserveNewLines: true, columnSplitter: ' | ' }));
}

function onError(err) {
    console.error(err);
    process.exit();
}

function pretty(data: any): string {
    return prettyJson.render(data);
}
