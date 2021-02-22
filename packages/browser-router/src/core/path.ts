import {IPath} from '@do-while-for-each/path-resolver'
import {To} from './contract'

export class Path implements IPath {

  static of(to: To): Path {
    const {pathname, search, hash} = Path.normalize(to)
    return new Path(pathname, search, hash)
  }

  constructor(public pathname: string,
              public search: string,
              public hash: string) {
  }

  isEquals(path: IPath) {
    return Path.isEquals(this, path)
  }

  isLocationEquals(path: IPath) {
    return Path.isLocationEquals(this, path)
  }

  toString() {
    return Path.toString(this)
  }

  simplify(): IPath {
    return Path.normalize(this)
  }


  static isEquals(p1: IPath, p2: IPath): boolean {
    return p1.pathname === p2.pathname
      && p1.search === p2.search
      && p1.hash === p2.hash
  }

  static isLocationEquals(p1: IPath, p2: IPath): boolean {
    return p1.pathname === p2.pathname
      && p1.search === p2.search
  }

  static toString({pathname, search, hash}: IPath): string {
    return pathname + search + hash
  }

  static parse(str: string): URL {
    const url = str.includes('http:') || str.includes('https:')
      ? str
      : window.location.origin + Path.normalizePathname(str)
    return new URL(url)
  }

  /**
   * Interface IPath can implement a wide variety of objects.
   * But using the passed object directly can lead to unexpected problems.
   * Therefore, the object is truncated exactly to the composition of the IPath fields.
   */
  static normalize(to: To): IPath {
    const path = typeof to === 'string'
      ? Path.parse(to)
      : to
    return {
      pathname: Path.normalizePathname(path.pathname),
      search: Path.normalizeSearch(path.search),
      hash: Path.normalizeHash(path.hash)
    }
  }

  static normalizePathname(pathname: string): string {
    return pathname
      ? pathname[0] === '/' ? pathname : `/${pathname}`
      : '/' // e.g. for url 'http://example.org:8888/?q=baz#bang' pathname => '/'
  }

  static normalizeSearch(search: string): string {
    return search
      ? search[0] === '?' ? search : `?${search}`
      : ''
  }

  static normalizeHash(hash: string): string {
    return hash
      ? hash[0] === '#' ? hash : `#${hash}`
      : ''
  }

}
