const path = require('path')
const ZipPlugin = require('zip-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const buildDir = path.resolve(__dirname, '../.build')

module.exports = {
  mode: 'development',
  target: 'node',
  node: {
    __dirname: false,
  },
  devtool: false,
  entry: { index: path.resolve(__dirname, '../src/aws') },
  output: {
    filename: '[name].js',
    path: buildDir,
    libraryTarget: 'commonjs',
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        exclude: /node_modules/,
        test: /\.(js)$/,
        loader: 'babel-loader',
        options: {
          rootMode: 'upward',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([buildDir], { root: path.resolve(__dirname, '..') }),
    new ZipPlugin({ filename: 'bundle.zip' }),
  ],
}
