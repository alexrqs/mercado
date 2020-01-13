const fs = require('fs');
const puppeteer = require('puppeteer')
const ProgressBar = require('progress')
const mongoose = require('mongoose');
const db = require('../db/db');
const Product = mongoose.model('PRODUCT')

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // page.on('console', consoleObj => console.log(consoleObj.text()));
  const LIMIT = 100
  const SKIP = 6000

  while ((await Product.find({ visited: false }).limit(LIMIT)).length > 99) {
    const hrstart = process.hrtime()
    const products = await Product.find({
      visited: false,
      error: { $ne: true },
    }).limit(LIMIT).skip(SKIP)
    const bar = new ProgressBar(':bar', { total: products.length });

    for (product of products) {
      bar.tick();
      // if (product.visited) { continue; }

      try {
        await page.goto(product.url)
        const data = await page.evaluate(() => {
          const $ = document.querySelector.bind(document)
          const $$ = document.querySelectorAll.bind(document)

          const name = $('.item-title__primary') && $('.item-title__primary').innerText

          const seller = $('#seller-view-more-link') ? $('#seller-view-more-link').href :  $('.official-store-info .title').innerHTML
          const quantity = parseInt($('.item-conditions') && $('.item-conditions').innerText.replace(/[^0-9]/g, ''), 10) || 0

          const [price, discount] = $$('#productInfo .price-tag-fraction')

          return {
            name,
            quantity,
            seller,
            price: discount ? discount.innerText : price.innerText,
          }
        })

        product.name = data.name
        product.price = parseInt(data.price.replace(/[^0-9]/g, ''), 10)
        product.quantity = data.quantity
        product.seller = data.seller
        product.visited = true

        await product.save()

        if (data.quantity > 450) {
          console.log(product);
        }
      } catch (e) {
        product.error = true

        await product.save()
        console.error('\n', product.url, {});
      }
    }

    const hrend = process.hrtime(hrstart)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
  }

  await browser.close();
}

main()
