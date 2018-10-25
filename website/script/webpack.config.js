const fs = require('fs')
const url = require('url')
const path = require('path')
const http = require('http')
const ManifestPlugin = require('webpack-manifest-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const production = process.env.NODE_ENV === 'production'

module.exports = {
  entry: {
    index: [
      path.join(__dirname, '../src/index.js'),
      path.join(__dirname, '../src/style/style.css'),
    ],
  },

  output: {
    path: path.join(__dirname, '../.build'),
    filename: production ? '[name]-[hash:8].js' : '[name].js',
    publicPath: process.env.APP_BASENAME || '/',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },

      {
        test: [/\.bmp/, /\.gif/, /\.jpe?g/, /\.png/, /\.otf/, /\.svg/, /\.css/],
        loader: 'file-loader',
        options: {
          name: '[name]-[hash:8].[ext]',
        },
      },
    ],
  },

  plugins: [
    new ManifestPlugin({ writeToFileEmit: true }),

    new HtmlWebpackPlugin({
      hash: true,
      template: path.resolve(__dirname, '../src/index.html'),
    }),

    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      generateStatsFile: true,
      reportFilename: 'bundle-analyzer-report.html',
      analyzerMode: 'static',
    }),
  ],

  devtool: production ? 'source-map' : false,

  devServer: {
    port: 8083,
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/,
    },
  },
}
