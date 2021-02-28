import {existsSync, mkdirSync, PathLike} from 'fs'

export class FileCheck {

  static ensureDir(path: PathLike) {
    if (!existsSync(path))
      mkdirSync(path)
  }

}
