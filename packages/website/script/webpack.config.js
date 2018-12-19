const fs = require('fs')
const url = require('url')
const path = require('path')
const http = require('http')
const ManifestPlugin = require('webpack-manifest-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const production = process.env.NODE_ENV === 'production'

const SUBMISSION_DIR_PATH = path.resolve(__dirname, '../../../submission')

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
            options: {
              rootMode: 'upward',
            },
          },
        ],
      },

      {
        test: [/\.bmp/, /\.gif/, /\.jpe?g/, /\.png/, /\.otf/, /\.svg/, /\.css/],
        loader: 'file-loader',
        options: {
          name: production ? '[name]-[hash:8].[ext]' : '[name].[ext]',
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

    production &&
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
        generateStatsFile: true,
        reportFilename: 'bundle-analyzer-report.html',
        analyzerMode: 'static',
      }),
  ].filter(Boolean),

  devtool: production ? 'source-map' : false,

  devServer: {
    port: 8083,
    historyApiFallback: true,
    stats: 'errors-only',
    watchOptions: {
      ignored: /node_modules/,
    },
    before: app =>
      app.use('/entry/*/*/images/*', async (req, res) => {
        const { originalUrl } = req
        const pathname = originalUrl.split('/entry')[1]

        const filePath = path.join(SUBMISSION_DIR_PATH, pathname)

        try {
          const content = fs.readFileSync(filePath)
          res.end(content)
        } catch (err) {
          res.end('404')
        }
      }),
  },

  optimization: {
    splitChunks: {
      minChunks: 2,
      chunks: 'all',

      cacheGroups: {
        vendors: false,

        /**
         * this chunk contains the node_modules that we are not going to change any time soon
         * and are most likely to be loaded on every page
         */
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /node_modules\/(react|react-dom|redux|react-redux|emotion|react-emotion|react-router)\//,
          priority: 20,
          enforce: true,
        },
      },
    },
  },
}
