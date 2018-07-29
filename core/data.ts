import js from 'jsonstream'
import fs from 'fs'
import _ from 'highland'
import Stream from './Stream'
import mkdirp from 'mkdirp'

function loadData<T>(key: string): Stream<T> {
    const loadPath = `${__dirname}/../data/${key}/data.json`;
    console.debug('Loading', { key, loadPath });

    return _(fs.createReadStream(loadPath))
                .through(js.parse('*'));
}

function saveData(key: string) {
    const saveDir = `${__dirname}/../data/${key}`
    const savePath = `${saveDir}/data.json`;
    console.debug('Saving', { key, savePath });

    mkdirp.sync(saveDir);

    return (data: Stream<any>) => {
        const out = fs.createWriteStream(savePath);

        data.through(js.stringify())
            .pipe(out);
        
        return _('close', out)
                .head()
                .map(a => key);
    }
}

export {
    loadData,
    saveData
};
