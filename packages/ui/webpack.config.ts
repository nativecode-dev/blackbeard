import * as TextPlugin from 'extract-text-webpack-plugin'
import * as fs from 'fs'
import * as path from 'path'
import * as wb from 'webpack'

const BundlePlugin = wb.optimize.UglifyJsPlugin
const IgnorePlugin = wb.IgnorePlugin

const Html = new TextPlugin('[name].html')
const Styles = new TextPlugin('[name].css')

const npm = JSON.parse(fs.readFileSync(path.resolve('package.json')).toString())
const optimize = process.env.NODE_ENV === 'production'

const configuration: wb.Configuration = {
  context: path.resolve('src'),
  devServer: {
    historyApiFallback: true,
    inline: true,
    port: 3000,
  },
  devtool: '#@source-map',
  entry: {
    app: './App.tsx',
    vendor: Object.keys(npm.dependencies),
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
      use: ['babel-loader', 'ts-loader'],
    }]
  },
  output: {
    filename: '[name].js',
    path: path.resolve('dist'),
  },
  plugins: [
    new BundlePlugin({
      beautify: optimize === false,
      compress: optimize,
      include: /\.js$/,
      mangle: optimize,
      sourceMap: optimize === false,
    }),
    new IgnorePlugin(/\/module\//),
    new IgnorePlugin(/\/node_fetch\//),
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

export default configuration
