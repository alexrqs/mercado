const fs = require('fs');
const puppeteer = require('puppeteer');
var ProgressBar = require('progress');
const stores = require('../data/stores.json');

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // page.on('console', consoleObj => console.log(consoleObj.text()));

  for (let store of stores.storesURL) {
    const storeName = store.url.replace('https://tienda.mercadolibre.com.co/', '')
    try {
      const products = JSON.parse(fs.readFileSync(`data/stores/${storeName}.json`)).items
      console.log(storeName);

      var bar = new ProgressBar(':bar', { total: products.length });
      let totalProducts = 0
      let totalMoney = 0
      for (product of products) {
        bar.tick();

        if (product.visited) { continue; }

        try {
          await page.goto(product.url)
          const data = await page.evaluate(() => {
            const $ = document.querySelector.bind(document)
            const $$ = document.querySelectorAll.bind(document)
            const name = $('.item-title__primary') && $('.item-title__primary').innerText
            const quantity = parseInt($('.item-conditions') && $('.item-conditions').innerText.replace(/[^0-9]/g, ''), 10) || 0

            const [price, discount] = $$('#productInfo .price-tag-fraction')

            return {
              name,
              quantity,
              price: discount ? discount.innerText : price.innerText,
            }
          })

          data.url = product.url

          if ((Math.random() * 100) > 90) {
            console.log({ quantity: data.quantity, url: data.url, price: data.price });
          }

          if (data.quantity > 300) {
            const highValue = JSON.parse(fs.readFileSync(`data/highValue.json`))
            highValue.items.push(data)

            fs.writeFileSync(`data/highValue.json`, JSON.stringify(highValue, null, '  '))
          }

          product.visited = true
          totalProducts += data.quantity
          totalMoney += parseInt(data.price.replace(/\./g, ''),10) * data.quantity

          fs.writeFileSync(`data/stores/${storeName}.json`, JSON.stringify({ items: products }, null, '  '))
        } catch (e) {
          console.log(product);
          console.log('navigation error', e);
        }
      }

      if (totalMoney > 100000000) {
        const dataMoney = JSON.parse(fs.readFileSync(`data/totalMoney.json`))
        dataMoney.items.push({ storeName, totalProducts, totalMoney: Number(totalMoney).toLocaleString() })

        fs.writeFileSync(`data/totalMoney.json`, JSON.stringify(dataMoney, null, '  '))

        console.log('totalProducts', totalProducts);
        console.log('totalMoney', Number(totalMoney).toLocaleString());
      }
    } catch (e) {
      console.log(e);
    }

  }

  await browser.close();
}

main()
