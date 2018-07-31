import js from 'jsonstream'
import fs from 'fs'
import _ from 'highland'
import Stream from './Stream'
import mkdirp from 'mkdirp'
import Key from './Key';

const info = console.info.bind(console);
const mkd = _.wrapCallback((p, cb) => mkdirp(p, cb));

function loadData<T>(key: Key): Stream<T> {
    const loadPath = `${__dirname}/../data/${key}/data.json`;

    info('Loading', { key, loadPath });
    return _(fs.createReadStream(loadPath))
                .through(js.parse('*'));
}

function saveData(key: Key): (d: Stream<any>) => Stream<Key> {
    const saveDir = `${__dirname}/../data/${key}`
    const savePath = `${saveDir}/data.json`;
    
    return (data) => {
        info('Saving', { key, savePath });
    
        return mkd(saveDir)
            .flatMap(p => {
                const file = fs.createWriteStream(savePath);

                data.through(js.stringify())
                    .pipe(file);
                
                return _('close', file)
                        .map(a => key)
                        .head();
            });
    }
}

export {
    loadData,
    saveData
};
