import * as path from 'path'
import wb from 'webpack'

const configuration: wb.Configuration = {
  entry: ['./src/App.tsx'],
  devServer: {
    historyApiFallback: true,
    inline: true,
    port: 3000,
  },
  devtool: '#@source-map',
  module: {
    rules: [{
      include: path.resolve('src'),
      test: /\.tsx?$/,
      use: ['babel-loader', 'ts-loader'],
    }]
  },
  output: {
    filename: 'app.js',
    path: path.resolve('dist/app-web'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: ['src', 'node_modules']
  },
  target: 'web'
}

export default configuration
