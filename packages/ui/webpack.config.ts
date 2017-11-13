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

const plugins = [
  Styles,
  new CheckerPlugin(),
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
    template: 'react.ejs',
    title: 'blackbeard',
  }),
  new TsConfigPathsPlugin(),
  new wb.optimize.CommonsChunkPlugin({
    name: 'vendor',
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
    port: 9000,
  },
  devtool: 'source-map',
  entry: {
    app: './App.tsx',
    manager: './AppManager.tsx',
    vendor: Object.keys(npm.dependencies),
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
    }]
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
  target: 'web'
}
