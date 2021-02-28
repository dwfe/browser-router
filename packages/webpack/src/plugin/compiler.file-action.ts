import {compilation, Compiler, Plugin} from 'webpack'
import {PathLike} from 'fs'
import {FileProcess, TCmd} from '../../../fs'

export class WebpackCompilerFileAction implements Plugin {
  constructor(private hookName: keyof compilation.CompilerHooks,
              private tasks: Array<[TCmd, [PathLike, PathLike?]]>) {
  }

  apply(compiler: Compiler) {
    compiler.hooks[this.hookName].tap('actions', () => {
      FileProcess.process(this.tasks)
    })

  }
}
