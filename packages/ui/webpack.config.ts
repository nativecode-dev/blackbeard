import * as TextPlugin from 'extract-text-webpack-plugin'
import * as fs from 'fs'
import * as path from 'path'
import * as wb from 'webpack'

import { CheckerPlugin, TsConfigPathsPlugin } from 'awesome-typescript-loader'

const BundlePlugin = wb.optimize.UglifyJsPlugin
const IgnorePlugin = wb.IgnorePlugin

const Html = new TextPlugin('[name].html')
const Styles = new TextPlugin('[name].css')

const npm = JSON.parse(fs.readFileSync(path.resolve('package.json')).toString())
const optimize = process.env.NODE_ENV === 'production'

export default {
  context: path.resolve('src'),
  devServer: {
    historyApiFallback: true,
    inline: true,
    port: 3000,
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
      test: /\.html$/,
      use: Html.extract({
        fallback: 'file-loader',
        use: ['html-loader']
      }),
    }, {
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
    library: '@nativecode/blackbeard.ui',
    libraryTarget: 'commonjs2',
    path: path.resolve('dist'),
  },
  plugins: [
    new CheckerPlugin(),
    new TsConfigPathsPlugin(),
    /*
    new BundlePlugin({
      beautify: optimize === false,
      compress: optimize,
      include: /\.js$/,
      mangle: optimize,
      sourceMap: optimize === false,
    }),
    */
    Html,
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
