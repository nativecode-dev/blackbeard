import * as HtmlWebpackPlugin from 'html-webpack-plugin'

import * as BundlePlugin from 'uglifyjs-webpack-plugin'
import * as TextPlugin from 'extract-text-webpack-plugin'
import * as fs from 'fs'
import * as path from 'path'
import * as wb from 'webpack'

import { CheckerPlugin, TsConfigPathsPlugin } from 'awesome-typescript-loader'

const Styles = new TextPlugin('[name].css')

const npm = JSON.parse(fs.readFileSync(path.resolve('package.json')).toString())
const production = process.env.NODE_ENV === 'production'

const plugins = [
  Styles,
  new BundlePlugin(),
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
    template: 'App.ejs',
    title: 'blackbeard',
  }),
  new TsConfigPathsPlugin(),
]

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
    filename: production ? '[name].[hash].js' : '[name].js',
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
