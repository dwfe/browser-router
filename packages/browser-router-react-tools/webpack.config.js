const {join, resolve} = require('path')

const DIST = resolve(__dirname, './dist')
const SRC = resolve(__dirname, './src')

module.exports = {
  mode: 'production',
  entry: './index.tsx',
  output: {
    path: DIST,
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: (url, resourcePath, context) =>
            'js' + resourcePath.replace(context, '')
        },
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
}
