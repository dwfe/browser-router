import {GoTo, Route, RoutingResult} from './core/contract'

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
export const cloneResult = (r: RoutingResult): RoutingResult => {
  const r2 = {...r}
  if (r2.customTo) {
    r2.customTo = {...r2.customTo}
  }
  return r2
}
export const cloneRoute = (r: Route): Route => {
  const r2 = cloneResult(r) as Route
  if (r2.note)
    r2.note = {...r2.note}
  return r2
}
