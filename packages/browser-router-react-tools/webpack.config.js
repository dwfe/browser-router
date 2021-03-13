const {WebpackCompilerFileAction} = require('@do-while-for-each/webpack')
const {join, resolve} = require('path')

const DIST = resolve(__dirname, './dist')

module.exports = {
  mode: 'production',
  entry: './index.tsx',
  output: {
    path: DIST,
    filename: 'index.js',
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
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new WebpackCompilerFileAction('done', [
      ['delete-path', [join(DIST, 'index.js')]],
    ]),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
}
