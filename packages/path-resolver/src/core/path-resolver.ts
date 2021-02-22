import {compile, match as matcher} from 'path-to-regexp'
import {defaultOptions, PathResolveResult, Route, Routes, RoutingResult} from './contract'
import {Clone} from './clone'
import {Init} from './init'

export class PathResolver {
  routes: Routes = [];

  constructor(routes: Routes,
              public options = defaultOptions) {
    this.routes = routes.map(route => Init.route(route, '/'))
  }

  resolve(pathname: string): PathResolveResult | undefined {
    this.log(`resolving '${pathname}'`)
    return this.find(pathname, this.routes)
  }

  find(pathname: string, routes: Routes | undefined, parentRoute?: Route): PathResolveResult | undefined {
    if (!routes) return;

    for (let i = 0; i < routes.length; i++) {
      const route = Clone.route(routes[i])
      const match = matcher(route.path)(pathname)
      this.log(`[${match ? 'v' : 'x'}] ${route.path}`)

      if (match && !PathResolver.needToMatchChildren(route)) {
        const pathParams = match.params
        if (route.redirectTo) {
          route.redirectTo = compile(route.redirectTo)(pathParams)
        }
        if (route.customTo) {
          route.customTo.pathname = compile(route.customTo.pathname)(pathParams)
        }
        return {route, pathParams, parentRoute}
      }
      const found = this.find(pathname, route.children, route)
      if (found) return found
    }
  }

  correctResultFromAction(pathname: string, result: RoutingResult, route: Route, parentRoute?: Route) {
    if (result.redirectTo === undefined && result.customTo === undefined)
      return;

    const parentPath = parentRoute ? parentRoute.path : '/'
    result.redirectTo = Init.to(result.redirectTo, parentPath)
    result.customTo = Init.customTo(result.customTo, parentPath)

    const match = matcher(route.path)(pathname)
    if (match) {
      const pathParams = match.params
      if (result.redirectTo !== undefined) {
        result.redirectTo = compile(result.redirectTo)(pathParams)
      }
      if (result.customTo) {
        result.customTo.pathname = compile(result.customTo.pathname)(pathParams)
      }
    }
  }

  static needToMatchChildren({redirectTo, component, children}: Route): boolean {
    return redirectTo === undefined && component === undefined // if 'redirectTo' and 'component' are omitted
      && children !== undefined && children.length > 0         // but children are available
  }

  private log(path: string) {
    if (this.options.isDebug)
      console.log(' ', path)
  }

}
