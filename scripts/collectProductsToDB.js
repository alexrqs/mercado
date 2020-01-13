const fs = require('fs');
const mongoose = require('mongoose')
const puppeteer = require('puppeteer');
const db = require('../db/db');
const categories = require('../data/subcategories.json');

const Product = mongoose.model('PRODUCT')

async function main() {
  try {
    await db
  } catch (e) {
    console.log(e);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // page.on('console', consoleObj => console.log(consoleObj.text()));
  let nextSelector = null

  for (let category of categories.subcategories) {
    console.log('cat');
    if (category.visited) { continue; }
    console.log('cat2');

    try {
      const categoryName = category.url
        .replace(/(^https:\/\/.+mercadolibre\.com\.co\/|\/$)/g, '')
        .replace(/\//g, '-')

      await page.goto(category.url)
      let len = 0
      do {
        const items = await page.evaluate(category => Array.from(document.querySelectorAll('li.results-item .item__title a.item__info-title'))
          .map(i => {
            if (/click1\.mercadolibre\.com\.co\//g.test(i.href)) {
              return false
            }
            const linkParser = document.createElement('a')
            linkParser.href = i.href

            return ({
              url: linkParser.protocol + '//' + linkParser.hostname + linkParser.pathname,
              category,
            })
          }).filter(Boolean), categoryName)

        try {
          await Product.insertMany(items, { ordered: false })
        } catch (e) {
          console.error({}, ' --Error', category.url, e && e.writeErrors && e.writeErrors.length);
        }

        len += items.length
        console.log(categoryName, await page.evaluate(() => document.querySelector('.andes-pagination__button--current a').innerHTML));
        nextSelector = await page.evaluate(selector => document.querySelector(selector) && document.querySelector(selector).href || null, '.andes-pagination__button.andes-pagination__button--next a')
        nextSelector && await page.goto(nextSelector)
      } while (nextSelector);

      if (len > 0) {
        category.visited = true
        fs.writeFileSync('data/subcategories.json', JSON.stringify(categories, null, '  '))
      }

      console.log('cat3', category.url, len);
    } catch (e) {
      console.log('navigation error', category.url);
      console.log(e);
    }
  }

  await browser.close();
}

main()
