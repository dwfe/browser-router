import {IPath} from './contract'

export class Path implements Partial<IPath> {

  constructor(public readonly pathname?: string,
              public readonly search?: string,
              public readonly hash?: string) {
  }

  isEquals(path: Partial<IPath>) {
    return Path.isEquals(this, path);
  }

  toString() {
    return Path.toString(this);
  }

  static of({pathname = '', search = '', hash = ''}: Partial<IPath>): Path {
    return new Path(pathname, search, hash);
  }

  static isEquals(p1: Partial<IPath>, p2: Partial<IPath>): boolean {
    p1 = Path.of(p1)
    p2 = Path.of(p2)
    return p1.pathname === p2.pathname
      && p1.search === p2.search
      && p1.hash === p2.hash
  }

  static toString({pathname, search, hash}: Partial<IPath>): string {
    if (!pathname)
      return ''

    if (search)
      search = search[0] === '?' ? search : '?' + search
    else
      search = ''

    if (hash)
      hash = hash[0] === '#' ? hash : '#' + hash
    else
      hash = ''

    return pathname + search + hash;
  }

}
