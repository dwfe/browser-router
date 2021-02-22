import {closeSync, copyFileSync, lstatSync, openSync, PathLike, readdirSync, RmDirOptions, rmdirSync, unlinkSync} from 'fs'
import {join} from 'path'

export type TCmd = 'clean-dir' | 'copy-file' | 'move-file'

export class F {

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
    F.copyFile(src, dest, true, flags)
  }

  static process(tasks: Array<[TCmd, [PathLike, PathLike?]]>) {
    tasks.forEach(([cmd, [src, dest]]) => {
      switch (cmd) {
        case 'clean-dir':
          console.log(`==========================\r\n Cleaning dirs \r\n==========================`);
          F.cleanDir(src, {recursive: true})
          console.log(`> clean dir '${src}'`)
          console.log(`==========================\r\n\r\n`)
          return;
        case 'move-file':
          console.log(`==========================\r\n Moving files \r\n==========================`);
          F.moveFile(src, dest)
          console.log(`> move '${src}' -> '${dest}'`)
          console.log(`==========================\r\n\r\n`)
          return;
        case 'copy-file':
          console.log(`==========================\r\n Copying files \r\n==========================`);
          F.copyFile(src, dest)
          console.log(`> copy '${src}' -> '${dest}'`)
          console.log(`==========================\r\n\r\n`)
          return;
        default:
          throw new Error(`unknown cmd type '${cmd}'`)
      }
    })
  }
}

