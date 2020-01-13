const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
  quantity: {
    type: Number,
    index: true,
  },
  visited: {
    type: Boolean,
    default: false,
  },
  url: {
    type: String,
    unique: true,
  },
  error: {
    type: Boolean,
    default: false,
  }
})

module.exports = mongoose.model('CATEGORY', CategorySchema)
