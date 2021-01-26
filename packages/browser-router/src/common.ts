import {GoTo} from '@do-while-for-each/path-resolver'
import {PartialPath, Path} from 'history'

export const excludeFirstSymbol = (symbol: string, target: string | undefined): string | undefined =>
  target
    ? target[0] === symbol ? target.slice(1) : target
    : target
;

export const addFirstSymbol = (symbol: string, target: string | undefined): string | undefined =>
  target
    ? target[0] === symbol ? target : symbol + target
    : target
;


export const isGoAway = ({origin, target}: GoTo) =>
  target === '_blank'
  || origin && origin !== window.location.origin // eslint-disable-line
;
export const getUrl = ({href, origin, pathname, search, hash}: GoTo): string =>
  href || `${origin || ''}${pathname || ''}${search || ''}${hash || ''}`
;
export const convertGoToFromStr = (to: GoTo | string): GoTo =>
  typeof to === 'string'
    ? {pathname: to}
    : to
;

export const createPath = ({pathname = '', search = '', hash = ''}: PartialPath): Path => ({pathname, search, hash})
export const createPathStr = ({pathname, search, hash}: PartialPath): string => {
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

  return pathname + search + hash
}
export const isEqualPaths = (p1: PartialPath, p2: PartialPath) => {
  p1 = createPath(p1)
  p2 = createPath(p2)
  return p1.pathname === p2.pathname
    && p1.search === p2.search
    && p1.hash === p2.hash
}
