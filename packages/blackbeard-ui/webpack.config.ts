import * as ExtractText from 'extract-text-webpack-plugin'
import * as fs from 'fs'
import * as path from 'path'
import * as wb from 'webpack'

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
      use: ['html-loader'],
    }, {
      test: /\.scss$/,
      use: ExtractText.extract({
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
  plugins: [new wb.optimize.UglifyJsPlugin({
    beautify: optimize === false,
    compress: optimize,
    include: /\.js$/,
    mangle: optimize,
    sourceMap: optimize === false,
  }), new ExtractText({
    filename: 'styles.css',
  })],
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
