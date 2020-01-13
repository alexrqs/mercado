const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  quantity: {
    type: Number,
    index: true,
  },
  seller: String,
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
},
{
  timestamps: true,
})

module.exports = mongoose.model('PRODUCT', ProductSchema)
