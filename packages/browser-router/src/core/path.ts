import {IPath} from '@do-while-for-each/path-resolver'
import {To} from './contract'

export class Path implements IPath {

  static of({pathname, search, hash}: IPath): Path {
    return new Path(Path.fixPathname(pathname), Path.fixSearch(search), Path.fixHash(hash))
  }

  constructor(public pathname: string,
              public search?: string,
              public hash?: string) {
  }

  isEquals(path: IPath) {
    return Path.isEquals(this, path)
  }

  isEqualsLocation(path: IPath) {
    return Path.isEqualsLocation(this, path)
  }

  toString() {
    return Path.toString(this)
  }


  static isEquals(p1: IPath, p2: IPath): boolean {
    return p1.pathname === p2.pathname
      && p1.search === p2.search
      && p1.hash === p2.hash
  }

  static isEqualsLocation(p1: IPath, p2: IPath): boolean {
    return p1.pathname === p2.pathname
      && p1.search === p2.search
  }

  static toString({pathname, search, hash}: IPath): string {
    return pathname + search + hash
  }

  static fixPathname(pathname: string): string {
    return pathname
      ? pathname[0] === '/' ? pathname : `/${pathname}`
      : ''
  }

  static fixSearch(search: string): string {
    return search
      ? search[0] === '?' ? search : `?${search}`
      : ''
  }

  static fixHash(hash: string): string {
    return hash
      ? hash[0] === '#' ? hash : `#${hash}`
      : ''
  }

  static normalize(to: To): IPath {
    const {pathname, search, hash} = typeof to === 'string'
      ? new URL(window.location.origin + Path.fixPathname(to))
      : to
    return {pathname, search, hash}
  }

}
