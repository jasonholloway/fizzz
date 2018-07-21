import scrape from 'scrape-it'
import _ from 'highland'
import js from 'jsonstream'

const url = 'https://restaurantsofmanchester.com';

scrapePageLinks(url)    
    .flatMap(a => scrapePage(a.href))
    .take(200)
    .pipe(js.stringify())
    .pipe(process.stdout);
    
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
