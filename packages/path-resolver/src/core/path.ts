import {IPath} from './contract'

export class Path implements IPath {

  static of({pathname, search, hash}: IPath): Path {
    return new Path(Path.fixPathname(pathname), Path.fixSearch(search), Path.fixHash(hash));
  }

  constructor(public pathname: string,
              public search?: string,
              public hash?: string) {
  }

  isEquals(path: IPath) {
    return Path.isEquals(this, path);
  }

  toString() {
    return Path.toString(this);
  }

  static isEquals(p1: IPath, p2: IPath): boolean {
    return p1.pathname === p2.pathname
      && p1.search === p2.search
      && p1.hash === p2.hash
  }

  static toString({pathname, search, hash}: IPath): string {
    return pathname + search + hash;
  }

  static fixPathname(pathname: string): string {
    if (pathname)
      return pathname[0] === '/' ? pathname : `/${pathname}`;
    return '/';
  }

  static fixSearch(search: string): string {
    if (search)
      return search[0] === '?' ? search : `?${search}`;
    return '';
  }

  static fixHash(hash: string): string {
    if (hash)
      return hash[0] === '#' ? hash : `#${hash}`;
    return '';
  }

}
