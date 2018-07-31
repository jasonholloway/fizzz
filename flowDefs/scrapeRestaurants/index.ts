import Start from "../../core/Start";
import ManchesterCom from '../../sources/ManchesterCom'

const scraper = new ManchesterCom();

export default
    (start: Start) =>
        start(x => {
            const keys = scraper.run()
                            .take(100)
                            .through(x.save('mancCom2'));
            
            return x.save('keys')(keys);
        })
        .then((x, keys) => {
            console.debug('keys', keys);            //keys here is an array
                                                    //because it is persisted as data in an object, instead of as a temp value
            return x.load('keys')
                    .reduce(0, (c, r) => c + 1)
                    .tap(c => console.debug('Total', c))
        });
