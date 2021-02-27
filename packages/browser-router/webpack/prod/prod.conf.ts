import {Configuration} from 'webpack'
import {join, resolve} from 'path'
import {WebpackCompilerFileAction} from '../plugin/webpack-compiler.file-action'

const DIST = resolve(__dirname, '../../../')

export default {
  mode: 'production',
  entry: join(DIST, 'js/index.js'),
  output: {
    path: DIST,
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  plugins: [
    new WebpackCompilerFileAction('done', [
      ['clean-dir', [join(DIST, 'js')]],
      ['move-file', [join(DIST, 'index.js'), join(DIST, 'js/index.js')]]
    ])
  ]
} as Configuration
