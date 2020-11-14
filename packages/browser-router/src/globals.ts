import {GoTo} from '@do-while-for-each/path-resolver'

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
export const getLocalRoute = (to: GoTo): GoTo => ({
  pathname: to.pathname,
  search: to.search,
  hash: to.hash
})
export const convertGoToFromStr = (to: GoTo | string): GoTo =>
  typeof to === 'string'
    ? {pathname: to}
    : to
;
