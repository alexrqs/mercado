const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HTMLPage = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const { viewsLoader, jsLoader, stylusLoader, CSSLoader } = require('./loaders')

module.exports = {
  devtool: 'source-map',

  entry: {
    main: path.resolve(__dirname, '../src/main.js'),
    background: path.resolve(__dirname, '../src/background/main.js'),
  },

  mode: 'development',

  module: {
    rules: [stylusLoader, viewsLoader, jsLoader, CSSLoader],
  },

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
  },

  plugins: [
    new CaseSensitivePathsPlugin(),
    new HTMLPage({
      template: 'views/index.pug'
    }),
  ]
}
