import {Route, RoutingResult} from './contract'

export class Clone {

  static result(r: RoutingResult): RoutingResult {
    const r2 = {...r}
    if (r2.customTo) {
      r2.customTo = {...r2.customTo}
    }
    return r2
  }

  static route(r: Route): Route {
    const r2 = Clone.result(r) as Route
    if (r2.note)
      r2.note = {...r2.note}
    return r2
  }

}
