import {closeSync, copyFileSync, lstatSync, openSync, PathLike, readdirSync, RmDirOptions, rmdirSync, unlinkSync} from 'fs'
import {join} from 'path'
import {TCmd} from './contract'

export class FileProcess {

  static run(tasks: Array<[TCmd, [PathLike, PathLike?]]>) {
    tasks.forEach(([cmd, [src, dest]]) => {
      switch (cmd) {
        case 'clean-dir':
          FileProcess.cleanDir(src, {recursive: true})
          console.log(`> clean dir '${src}' \r\n`)
          return;
        case 'move-file':
          FileProcess.moveFile(src, dest)
          console.log(`> move file '${src}' -> '${dest}' \r\n`)
          return;
        case 'copy-file':
          FileProcess.copyFile(src, dest)
          console.log(`> copy file '${src}' -> '${dest}' \r\n`)
          return;
        case 'delete-path':
          FileProcess.deletePath(src, {recursive: true})
          console.log(`> delete path '${src}' \r\n`)
          return;
        default:
          throw new Error(`unknown command type '${cmd}'`)
      }
    })
  }

  static cleanDir(source: PathLike, options?: RmDirOptions) {
    const fileNames = readdirSync(source);
    fileNames.forEach(file => {
      const path = join(source.toString(), file)
      FileProcess.deletePath(path, options)
    })
  }

  static copyFile(src: PathLike, dest: PathLike, isMove = false, flags?: number): void {
    try {
      copyFileSync(src, dest)
      if (isMove) unlinkSync(src)
    } catch (e) {
      closeSync(openSync(dest, 'w'))
      console.error(e)
    }
  }

  static moveFile(src: PathLike, dest: PathLike, flags?: number): void {
    FileProcess.copyFile(src, dest, true, flags)
  }

  static deletePath(path: PathLike, options?: RmDirOptions): void {
    if (lstatSync(path).isDirectory())
      rmdirSync(path, options)
    else
      unlinkSync(path)
  }

}

