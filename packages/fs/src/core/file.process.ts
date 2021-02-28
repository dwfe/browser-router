import {closeSync, copyFileSync, lstatSync, openSync, PathLike, readdirSync, RmDirOptions, rmdirSync, unlinkSync} from 'fs'
import {join} from 'path'
import {TCmd} from './contract'

export class FileProcess {

  static process(tasks: Array<[TCmd, [PathLike, PathLike?]]>) {
    tasks.forEach(([cmd, [src, dest]]) => {
      switch (cmd) {
        case 'clean-dir':
          console.log(`==========================\r\n Clean dirs \r\n==========================`);
          FileProcess.cleanDir(src, {recursive: true})
          console.log(`> clean dir '${src}'`)
          console.log(`==========================\r\n\r\n`)
          return;
        case 'move-file':
          console.log(`==========================\r\n Move files \r\n==========================`);
          FileProcess.moveFile(src, dest)
          console.log(`> move file '${src}' -> '${dest}'`)
          console.log(`==========================\r\n\r\n`)
          return;
        case 'copy-file':
          console.log(`==========================\r\n Copy files \r\n==========================`);
          FileProcess.copyFile(src, dest)
          console.log(`> copy file '${src}' -> '${dest}'`)
          console.log(`==========================\r\n\r\n`)
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
      if (lstatSync(path).isDirectory())
        rmdirSync(path, options)
      else
        unlinkSync(path)
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

}

