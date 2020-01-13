const fs = require('fs');
const puppeteer = require('puppeteer');

const URL = 'https://www.mercadolibre.com.co/tiendas-oficiales/catalogo'

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(URL);
  await page.screenshot({ path: 'scripts/screenshots/home.png' });

  const stores = await page.evaluate(() => {
    const linkNodes = document.querySelectorAll('.item-grid-show a');
    return Array.from(linkNodes).map(store => ({ url:store.href, visited: false }))
  })

  fs.writeFileSync('data/stores.json', JSON.stringify({ storesURL: stores }, null, '  '))

  await browser.close();
}

main()
