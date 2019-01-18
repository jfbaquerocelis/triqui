const path = require('path')
const CssExtractPlugin = require('mini-css-extract-plugin')

const webpack = {
  mode: 'production',
  entry: './assets/js/triqui.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          { loader: (process.env.NODE_ENV === 'development') ? 'style-loader' : CssExtractPlugin.loader },
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      sass: path.resolve(__dirname, 'assets/sass'),
      js: path.resolve(__dirname, 'assets/js')
    }
  },
  plugins: [
    new CssExtractPlugin({
      filename: 'style.css'
    })
  ]
}

module.exports = webpack
