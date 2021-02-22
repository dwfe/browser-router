import {Compiler, Plugin} from 'webpack'
import {PathLike} from 'fs'
import {F, TCmd} from '../F'

export class DoneActions implements Plugin {
  constructor(private tasks: Array<[TCmd, [PathLike, PathLike?]]>) {
  }

  apply(compiler: Compiler) {
    compiler.hooks.done.tap('actions', () => {
      F.process(this.tasks)
    })

  }
}
