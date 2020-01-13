const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    background: path.resolve('src/background/main.js')
  },

  mode: 'development',

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  }

  output: {
    filename: '[name].js'
  }

  plugins: [
    new CopyWebpackPlugin([
      { from: 'public', to: 'dist'}
    ])
  ]
}
