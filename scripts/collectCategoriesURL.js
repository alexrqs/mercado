const fs = require('fs')
const puppeteer = require('puppeteer')
const allCategories = require('../data/allCategories.json');

async function CollectTopCategories() {
  const URL = 'https://www.mercadolibre.com.co/categorias#menu=categories'
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(URL);

  let categories = await page.evaluate(() => {
    const linkNodes = document.querySelectorAll('.categories__item a');
    return Array.from(linkNodes).map(cat => {
      if (
        /^https:\/\/carros.mercadolibre.com.co\/$/g.test(cat.href) ||
        /^https:\/\/motos.mercadolibre.com.co\/$/g.test(cat.href) ||
        /vehiculos\.mercadolibre\.com\.co\/camiones/g.test(cat.href) ||
        /vehiculos\.mercadolibre\.com\.co\/carros\-coleccion/g.test(cat.href) ||
        /vehiculos\.mercadolibre\.com\.co\/maquinaria\-pesada/g.test(cat.href) ||
        /vehiculos\.mercadolibre\.com\.co\/nautica/g.test(cat.href) ||
        /vehiculos\.mercadolibre\.com\.co\/otros/g.test(cat.href)
      ) {
        return false
      }

      return ({
        name: cat.innerText,
        url: cat.href,
        visited: false
      })
    }).filter(Boolean)
  })

  for (cat of categories) {
    await page.goto(cat.url)
    console.log(cat.url);
    cat.totalItems = await page.evaluate(() => parseInt(document.querySelector('.quantity-results').innerText.replace(/([^0-9]|\.)/g, ''), 10))
  }

  fs.writeFileSync('data/allCategories.json', JSON.stringify({
    categoriesURL: categories,
  }, null, '  '))

  await browser.close();
}

async function collectInnerCats() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  async function loop(categoriesURL) {
    for (let category of categoriesURL) {
      console.log(category.url);
      await page.goto(category.url)

      const subcats = category.totalItems < 2000 ? [category] : await page.evaluate(async () => {
        function time(t) { return new Promise(res => setTimeout(res, t)) }

        let categoriesContainer = document.querySelector('#id_category') || document.querySelector('#id_state')
        const seeMore = categoriesContainer.querySelector('.see-more-category-filter')

        if (seeMore) {
          seeMore.click()
          // await time(1000)
          categoriesContainer = document.querySelector('.modal-container')
        }

        return Array.from(categoriesContainer.querySelectorAll('.filters__group__option')).map(sub => ({
            // name: sub.querySelector('.filter-name').innerHTML,
            url: sub.querySelector('a').href,
            // totalItems: parseInt(sub.querySelector('.filter-results-qty').innerHTML.replace(/([^0-9]|\.)/g, ''), 10),
            visited: false,
        }))

        // return parseInt(document.querySelector('.quantity-results').innerText.replace(/([^0-9]|\.)/g, ''), 10)
      })

      // category.totalItems = totalItems
      // category.subCategories = subcats
      const allsubs = JSON.parse(fs.readFileSync('data/subcategories.json'))

      allsubs.subcategories = allsubs.subcategories.concat(subcats)
      fs.writeFileSync('data/subcategories.json', JSON.stringify(allsubs, null, '  '))
    }
  }

  await loop(allCategories.categoriesURL)
}

function countProducts () {
  const total = allCategories.categoriesURL.reduce((acc, item) => {
    return acc + item.totalItems
  }, 0)

  console.log(total);
}

collectInnerCats()
// CollectTopCategories()
// countProducts()
