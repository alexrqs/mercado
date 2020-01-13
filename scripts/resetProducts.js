const fs = require('fs');
const stores = require('../data/stores.json');

async function main() {
  for (let store of stores.storesURL) {

    try {
      const storeName = store.url
        .replace('https://tienda.mercadolibre.com.co/', '')
        .replace('https://listado.mercadolibre.com.co/', '')
        .replace('https://www.mercadolibre.com.co/ofertas/', '')
      const products = JSON.parse(fs.readFileSync(`data/stores/${storeName}.json`)).items

      fs.writeFileSync(`data/stores/${storeName}.json`, JSON.stringify({
        items: products.map(prod => {
          if (/carro\.mercadolibre\.com\.co/g.test(prod.url)) {
            console.log(prod, store.url);
            return ({
              ...prod,
              visited: true
            })
          }

          return prod
        })
      }, null, '  '))
    } catch (e) {
      console.log('parsing error', store.url);
      console.log(e);
    }

  }
}

main()
