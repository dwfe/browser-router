import {join, resolve} from 'path'
import {Configuration} from 'webpack'
import {DoneActions} from './done.actions'

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
    new DoneActions([
      ['clean-dir', [join(DIST, 'js')]],
      ['move-file', [join(DIST, 'index.js'), join(DIST, 'js/index.js')]]
    ])
  ]
} as Configuration
