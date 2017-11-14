import * as HtmlWebpackPlugin from 'html-webpack-plugin'

import * as BundlePlugin from 'uglifyjs-webpack-plugin'
import * as ExtractTextPlugin from 'extract-text-webpack-plugin'
import * as fs from 'fs'
import * as path from 'path'
import * as wb from 'webpack'

import CssNano = require('cssnano')
import OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

import { CheckerPlugin, TsConfigPathsPlugin } from 'awesome-typescript-loader'

const npm = JSON.parse(fs.readFileSync(path.resolve('package.json')).toString())
const production = process.env.NODE_ENV === 'production'

console.log('environment:', process.env.NODE_ENV)

const Styles = new ExtractTextPlugin(production ? '[name].min.[hash].css' : '[name].css')

const minify = {
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
}

const plugins: any[] = [
  Styles,
  new CheckerPlugin(),
  new HtmlWebpackPlugin({
    appMountId: 'app',
    cache: true,
    chunk: 'app',
    excludeChunks: ['manager'],
    inject: false,
    filename: 'app.html',
    minify,
    template: 'react.ejs',
    title: 'blackbeard',
  }),
  new HtmlWebpackPlugin({
    appMountId: 'app',
    cache: true,
    chunk: 'manager',
    excludeChunks: ['app'],
    inject: false,
    filename: 'manager.html',
    minify,
    template: 'react.ejs',
    title: 'blackbeard-manager',
  }),
  new TsConfigPathsPlugin(),
  new wb.optimize.CommonsChunkPlugin({
    name: 'bundle',
  })
].concat(production ? [
  new BundlePlugin(),
  new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.css$/g,
    cssProcessor: CssNano,
    cssProcessorOptions: {
      discardComments: {
        removeAll: true
      }
    },
    canPrint: true
  }),
] : [])

export default {
  context: path.resolve('src'),
  devServer: {
    contentBase: path.resolve('dist'),
    compress: true,
    open: true,
    openPage: 'app.html',
    overlay: {
      errors: true,
      warnings: false,
    },
    port: 9000,
    stats: 'errors-only',
    watchContentBase: true,
  },
  devtool: 'source-map',
  entry: {
    app: './App.tsx',
    manager: './AppManager.tsx',
    bundle: Object.keys(npm.dependencies),
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
      use: ['awesome-typescript-loader'],
    }, {
      test: /\.json$/,
      use: ['json-loader']
    }],
    exprContextCritical: false,
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  output: {
    filename: production ? '[name].min.[hash].js' : '[name].js',
    path: path.resolve('dist'),
  },
  plugins,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [
      path.resolve('src'),
      path.resolve('node_modules'),
      path.resolve('../../node_modules'),
    ]
  },
  stats: {
    warningsFilter: ['the request of a dependency is an expression'],
  },
  target: 'web',
}
