import Start from "../../core/Start";
import ManchesterCom from '../../sources/ManchesterCom'
import _ from 'highland'


const scraper = new ManchesterCom();

export default
    (start: Start) =>
        start(x => scraper.run()
                        .take(50)
                        .through(x.save('mancCom2')))
        .then((x, keys) =>
            keys.flatMap(k => x.load(k))
                .reduce(0, (c, r) => c + 1)
                .tap(c => console.debug('Total', c)))
