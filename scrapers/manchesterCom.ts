import scrape from 'scrape-it'
import _ from 'highland'
import js from 'jsonstream'

const baseUrl = 'http://www.manchester.com'
const homePath = '/restaurants/manchester-restaurants.php';
const postcodeRegex = /(([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2}))/;

scrapePageLinks(baseUrl + homePath)
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
            .filter(a => /^\/restaurants\/details\/.+$/.test(a.href))
            .uniqBy((a, b) => a.href == b.href)
            .map(a => ({ href: `${baseUrl}${a.href}` }));
}

function scrapePage(url: string) {
    return _(scrape<{ title: string, address: string }>(
                url, {
                    title: {
                        selector: 'div.page-content h2',
                        how: el => el.text()
                    },
                    postcode: {
                        selector: 'div.page-content p',
                        how: el => el.text().match(postcodeRegex)[1]
                    },
                    phone: {
                        selector: 'div.side-right p',
                        how: el => el.first().text() //.match(/^Tel:\W*([\d ]+)/)[1]
                    }
                }
            ))
            .map(r => r.data)
}




