import {StandardProdConf} from '@dwfe/utils-dev'
import {Configuration} from 'webpack'
import {resolve} from 'path'

const DIST = resolve(__dirname, '../')

export default {
  ...new StandardProdConf(DIST).get(),
} as Configuration
