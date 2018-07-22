import columnify from 'columnify'
import prettyJson from 'prettyjson'
import clear from 'cli-clear'
import chokidar from 'chokidar'
import _ from 'highland'
import fs from 'fs'
import js from 'jsonstream'
import parseArgs from 'minimist'
import readline from 'readline'

const args = parseArgs(process.argv.slice(2));
const files = args._;

let offset = 0;
const refreshes = _();

setupKeys();

run().catch(onError);

async function run() {
    refreshes
        .flatMap(() => _(render()))
        .errors(onError)
        .each(() => {});

    setupWatcher();
}

async function render() {
    const count = 10;

    const diffs = _(files)
                    .map(loadJsonStream)
                    .zipAll0()
                    .drop(offset).take(count);    

    const cols = await diffs
                    .map(d => d.map(pretty))
                    .flatMap(s => [s, {}])
                    .collect()
                    .toPromise(Promise);

    clear();

    console.log(columnify(cols, { 
        preserveNewLines: true, 
        columnSplitter: ' | ' ,
        maxLineWidth: 'auto'
    }));
}

function onError(err) {
    console.error(err);
    process.exit();
}

function loadJsonStream(path: string): Highland.Stream<any> {
    return _(fs.createReadStream(path)
                .pipe(js.parse('*')))
}

function pretty(data: any): string {
    return prettyJson.render(data);
}

function setupWatcher() {
    const watcher = chokidar.watch(files, { 
        awaitWriteFinish: {
            stabilityThreshold: 400
        }
    });

    watcher.on('all', () => {
        refreshes.write(true);
    });
}

function setupKeys() {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    
    process.stdin.on('keypress', (str, key) => {
        if(!key) return;
    
        if(key.ctrl && key.name == 'c') {
            process.kill(process.pid, 'SIGINT');
            return;
        }
    
        switch(key.name) {
            case 'pageup':
                offset -= 5;
                refreshes.write(true);
                return;
    
            case 'pagedown':
                offset += 5;
                refreshes.write(true);
                return;
        }
    })
}
