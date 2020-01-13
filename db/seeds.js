const db = require('../db/db');
const mongoose = require('mongoose');

const DummySchema = new mongoose.Schema({
  name: String,
  url: {
    type: String,
    unique: true,
  },
})

mongoose.model('DUMMY', DummySchema)

const Dummy = mongoose.model('DUMMY')

async function main() {
  await db
  try {
    await Dummy.insertMany([{
      url: 'uno'
    }, {
      url: 'four'
    }], { ordered: false, w:1 }, function(err,result) {
      console.log(err.writeErrors);
      console.log(result);
    })
  } catch (e) {
    // console.log(e);
  }

  // mongoose.connection.close()
}

main()
