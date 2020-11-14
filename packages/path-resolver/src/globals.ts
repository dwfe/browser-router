import {Route, RoutingResult} from './core/contract'

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
