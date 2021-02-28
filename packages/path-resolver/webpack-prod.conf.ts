import {StandardProdConf} from '@dwfe/utils-node'
import {Configuration} from 'webpack'
import {resolve} from 'path'

const DIST = resolve(__dirname, '../')

export default {
  ...new StandardProdConf(DIST).get(),
} as Configuration
