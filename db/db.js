// require('dotenv').config()
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

// this line allows const User = mongoose.model('User')
require('../models/ProductSchema')
require('../models/CategorySchema')

const DATABASE_URL = 'mongodb://127.0.0.1:27017/mercado'
const db = mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

module.exports = db
