const miniCSS = require('mini-css-extract-plugin')

const viewsLoader = {
  test: /\.pug$/,
  loader: 'pug-loader',
}

const jsLoader = {
  test: /\.jsx?$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: ['babel-preset-primavera'],
    }
  }
}

const CSSLoader = {
  test: /\.css$/,
  use: ['style-loader', 'css-loader'],
}

const extractCSSLoader = {
  test: /\.css$/,
  use: [miniCSS.loader, 'css-loader'],
}

const stylusLoader = {
  test: /\.styl$/,
  exclude: /(node_modules|bower_components)/,
  use: ['style-loader', 'css-loader', 'stylus-loader'],
}

const extractStylusLoader = {
  test: /\.styl$/,
  use: [miniCSS.loader, 'css-loader', 'stylus-loader'],
}

module.exports = {
  CSSLoader,
  extractCSSLoader,
  jsLoader,
  viewsLoader,
  extractStylusLoader,
  stylusLoader,
}
