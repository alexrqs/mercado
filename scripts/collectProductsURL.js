Array.prototype.flattify = function () {
  for (var i = 0; i < this.length; i++) {
    if (this[i] instanceof Array) {
      this.splice.apply(this, [i, 1].concat(this[i]))
    }
  }
}

const fs = require('fs');
const puppeteer = require('puppeteer');
const stores = require('../data/stores.json');

async function main() {
  const failedVisits = []
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // page.on('console', consoleObj => console.log(consoleObj.text()));
  let nextSelector = null

  for (let store of stores.storesURL) {
    if (store.visited) { continue; }

    try {
      const data = []

      await page.goto(store.url)

      do {
        const items = await page.evaluate(() => Array.from(document.querySelectorAll('li.results-item a.item__info-link')).map(i => ({ url: i.href.split('#')[0], visited: false })))
        data.push(items)

        nextSelector = await page.evaluate(selector => document.querySelector(selector) && document.querySelector(selector).href || null, '.andes-pagination__button.andes-pagination__button--next a')
        nextSelector && await page.goto(nextSelector)
      } while (nextSelector);

      const storeName = store.url
        .replace('https://tienda.mercadolibre.com.co/', '')
        .replace('https://listado.mercadolibre.com.co/', '')
        .replace('https://www.mercadolibre.com.co/ofertas/', '')

      data.flattify()

      fs.writeFileSync(`data/stores/${storeName}.json`, JSON.stringify({ items: data }, null, '  '))
      store.visited = true
      fs.writeFileSync('data/stores.json', JSON.stringify(stores, null, '  '))
      console.log(data.length, store.url);
    } catch (e) {
      failedVisits.push({ url: store.url, visited: false })
      console.log('navigation error', store.url);
      console.log(e);
    }

  }
  fs.writeFileSync('data/errorStores.json', JSON.stringify(failedVisits, null, '  '))

  await browser.close();
}

main()
