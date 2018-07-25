import js from 'jsonstream'
import _ from 'highland'
import Stream from './core/Stream'
import MapReduceCombine from './core/MapReduceCombine'

const transform = loadTransform();

loadData()
    .through(transform.map)
    .through(transform.reduce)      
    //and now combine...
    .through(js.stringify())
    .stopOnError(onError)
    .pipe(process.stdout);

/**
 * but instead of loading from the command line
 * this in fact should load from a file and commit * 
 */

function loadTransform(): MapReduceCombine<any, any, any> {
    return require('./transforms/CleanTitles');
}

function loadData(): Stream<any> {
    return getInputJson() as Stream<any>;
}

function getInputJson() {
    return _(process.stdin.pipe(js.parse('*')));
}

function onError(err: Error) {
    console.error(err);
    process.exit();
}
