import Start from "../core/Start";
import ManchesterCom from '../sources/ManchesterCom'
import RestsOfManc from '../sources/RestsOfManc'

import fs from 'fs';
import _ from 'highland'
import csvParse from 'csv-parse'
import csv from 'csv-parser'
import hamt from 'hamt'

const mancCom = new ManchesterCom();
const restsOfManc = new RestsOfManc();

const info = console.info.bind(console);

export default
    (start: Start) =>
        start(x => mancCom.run()
                    .take(100)
                    .through(x.save('mancCom')))
        // .then(x => restsOfManc.run()
        //             .take(100)
        //             .through(x.save('restsOfManc')))
        .then(x => {
            return loadPostcodes()
                    .flatMap(postcodes => {
                        return x.load('mancCom')
                                .concat(x.load('restsOfManc'))
                                .doto(r => {
                                    if(r.postcode) {
                                        r.ll = postcodes.get(r.postcode);
                                    }
                                })
                                .through(x.save('improved'));
                    });
        });


const reManc = /^M[0-9]/

function loadPostcodes() {
    return _(fs.createReadStream('../ukpostcodes.csv').pipe(csv()))
            .filter((r: any) => reManc.test(r.postcode))
            .map((r: any) => ({ 
                code: r.postcode as string, 
                lat: parseFloat(r.latitude), 
                lon: parseFloat(r.longitude) 
            }))
            .reduce(hamt.empty, (codes, r) => {
                return codes.set(r.code, [r.lat, r.lon]);
            })
            .tap(h => info(`SIZE=${h.count()}`));
}