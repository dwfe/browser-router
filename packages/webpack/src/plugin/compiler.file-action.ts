import {compilation, Compiler, Plugin} from 'webpack'
import {FileProcess, TCmd} from '@dwfe/fs'
import {PathLike} from 'fs'

export class WebpackCompilerFileAction implements Plugin {
  constructor(private hookName: keyof compilation.CompilerHooks,
              private tasks: Array<[TCmd, [PathLike, PathLike?]]>) {
  }

  apply(compiler: Compiler) {
    compiler.hooks[this.hookName].tap('actions', () => {
      FileProcess.run(this.tasks)
    })

  }
}
