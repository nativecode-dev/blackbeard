import * as HtmlWebpackPlugin from 'html-webpack-plugin'

import * as TextPlugin from 'extract-text-webpack-plugin'
import * as fs from 'fs'
import * as path from 'path'
import * as wb from 'webpack'

import { CheckerPlugin, TsConfigPathsPlugin } from 'awesome-typescript-loader'

const BundlePlugin = wb.optimize.UglifyJsPlugin
const DefinePlugin = wb.DefinePlugin
const IgnorePlugin = wb.IgnorePlugin

const Styles = new TextPlugin('[name].css')

const npm = JSON.parse(fs.readFileSync(path.resolve('package.json')).toString())
const optimize = process.env.NODE_ENV === 'production'

export default {
  context: path.resolve('src'),
  devServer: {
    contentBase: path.resolve('dist'),
    compress: true,
    port: 9000,
  },
  devtool: 'source-map',
  entry: {
    app: './App.tsx',
    vendor: Object.keys(npm.dependencies),
  },
  externals: {
    'node-fetch': 'fetch'
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: Styles.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      }),
    }, {
      test: /\.tsx?$/,
      use: ['babel-loader', 'awesome-typescript-loader'],
    }]
  },
  output: {
    filename: '[name].js',
    path: path.resolve('dist'),
  },
  plugins: [
    new CheckerPlugin(),
    new TsConfigPathsPlugin(),
    new HtmlWebpackPlugin({
      appMountId: 'app',
      cache: true,
      inject: false,
      minify: {
        caseSensitive: true,
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: false,
        keepClosingSlash: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
      },
      template: 'App.ejs',
      title: 'blackbeard',
    }),
    Styles,
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [
      path.resolve('src'),
      path.resolve('node_modules'),
      path.resolve('../../node_modules'),
    ]
  },
  target: 'web'
}
