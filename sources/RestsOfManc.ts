import scrape from 'scrape-it'
import _ from 'highland'
import Source from '../core/Source';
import Stream from '../core/Stream';

const url = 'https://restaurantsofmanchester.com';

class RestsOfManc implements Source {
    run(): Stream<any> {
        return scrapePageLinks(url)    
                .flatMap(a => scrapePage(a.href));
    }
}
    
function scrapePageLinks(url: string) {
    return _(scrape<{ links: { href: string }[] }>(
                url, { 
                    links: {
                        listItem: 'a',
                        data: {            
                            href: { attr: 'href' }
                        }
                    }
            }))
            .flatMap(r => _(r.data.links))
            .filter(a => /^\w+\/\w+\.htm$/.test(a.href))
            .uniqBy((a, b) => a.href == b.href)
            .map(a => ({ href: `${url}/${a.href}` }));
}

function scrapePage(url: string) {
    return _(scrape<{ title: string, address: string }>(
                url, {
                    title: 'title',
                    address: {
                        selector: 'div.middle',
                        how: (el) => {
                            return el.find('img[alt=Address]')
                                    .first().parent().parent()
                                    .text();
                        }
                    }
                }
            ))
            .map(r => r.data)
}

export default RestsOfManc;
