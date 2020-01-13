const mongoose = require('mongoose')
const db = require('../db/db')
const categories = require('../data/subcategories.json')

const Category = mongoose.model('CATEGORY')

async function main() {
  await db
  try {
    // deleteMany prevents duplicated entries
    // how: when you delete the collection with mongodb compass
    // the indexes get messy and doesnt respect the "unique"ness of the schema field
    // YES the {} is necessary
    await Category.deleteMany({})
    // ordered false allows to continue entering fieds even with one previous fail
    await Category.insertMany(categories.subcategories, { ordered: false })
  } catch (e) {
    console.log(e);
  }
  console.log('done!');
}

main()
