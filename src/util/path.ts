import {hasProtocol, IPath, normalizePath, normalizePathname, pathToString} from '@do-while-for-each/common'
import {To} from '../core/contract'

export class Path implements IPath {

  static of(to: To): Path {
    const {pathname, search, hash} = Path.normalize(to)
    return new Path(pathname, search, hash)
  }

  constructor(public pathname: string,
              public search: string,
              public hash: string) {
  }

  toString(): string {
    return pathToString(this)
  }

  /**
   * Interface IPath can implement a wide variety of objects.
   * But using the passed object directly can lead to unexpected problems.
   * Therefore, the object is truncated exactly to the composition of the IPath fields.
   */
  static normalize(to: To): Required<IPath> {
    const path = typeof to === 'string' ? Path.parse(to) : to
    return normalizePath(path);
  }

  static parse(str: string): URL {
    const url = hasProtocol(str)
      ? str
      : window.location.origin + normalizePathname(str)
    return new URL(url)
  }

}
