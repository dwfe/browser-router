import {Compiler} from 'webpack'
import {PathLike} from 'fs'
import {FileProcess, TCmd} from '../../fs'

export class WebpackCompilerFileAction {
  constructor(private hookName: keyof Compiler['hooks'],
              private tasks: Array<[TCmd, [PathLike, PathLike?]]>) {
  }

  apply(compiler: Compiler) {
    compiler.hooks[this.hookName].tap('actions', (): any => {
      FileProcess.run(this.tasks)
    })
  }
}
