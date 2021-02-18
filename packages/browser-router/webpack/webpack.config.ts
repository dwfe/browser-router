import {join, resolve} from 'path'
import {Configuration} from 'webpack'

const DIST = resolve(__dirname, '../../')

export default {
  mode: 'development',
  entry: join(DIST, 'esm/index.js'),
  output: {
    path: DIST,
    filename: 'bundle.js',
  },
  devtool: 'source-map'
} as Configuration
