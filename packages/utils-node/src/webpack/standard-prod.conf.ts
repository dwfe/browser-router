import {Configuration} from 'webpack'
import {join} from 'path'
import {WebpackCompilerFileAction} from './plugin/compiler.file-action'

export class StandardProdConf {

  constructor(private distDir: string) {
  }

  get(): Configuration {
    return {
      mode: 'production',
      entry: join(this.distDir, 'js/index.js'),
      output: {
        path: this.distDir,
        filename: 'index.js',
        libraryTarget: 'umd'
      },
      plugins: [
        new WebpackCompilerFileAction('done', [
          ['clean-dir', [join(this.distDir, 'js')]],
          ['move-file', [join(this.distDir, 'index.js'), join(this.distDir, 'js/index.js')]]
        ])
      ]
    }
  }

}
