import {compile, match} from 'path-to-regexp'
import {defaultOptions, PathResolveResult, Route, Routes, RoutingResult} from './contract'
import {Clone} from './clone'
import {Init} from './init'

export class PathResolver {
  routes: Routes = [];

  constructor(routes: Routes,
              public options = defaultOptions) {
    routes.forEach(r => {
      const route = Clone.route(r)

      Init.checkLeadSlash(route.path)

      // Step 1. All root paths get a prefix '/'
      route.path = Init.path(route.path, '/')
      route.redirectTo = Init.to(route.redirectTo, '/')
      route.customTo = Init.customTo(route.customTo, '/')

      // Step 2. All children paths are obtained as follows:
      //         [full parent path] + '/' + [child path]
      route.children = Init.children(route)

      this.routes.push(route)
    })
  }

  resolve(pathname: string): PathResolveResult | undefined {
    this.log(`resolving '${pathname}'`)
    return this.find(pathname, this.routes)
  }

  find(pathname: string, routes: Routes | undefined, parentRoute?: Route): PathResolveResult | undefined {
    if (!routes)
      return;

    for (let i = 0; i < routes.length; i++) {
      const route = Clone.route(routes[i])
      const matching = match(route.path)(pathname)
      this.log(`[${!!matching ? 'v' : 'x'}] ${route.path}`)

      if (matching && !PathResolver.needToMatchChildren(route)) {
        const pathParams = matching.params
        if (route.redirectTo) {
          route.redirectTo = compile(route.redirectTo)(pathParams)
        }
        if (route.customTo) {
          route.customTo.pathname = compile(route.customTo.pathname)(pathParams)
        }
        return {route, pathParams, parentRoute}
      }
      const found = this.find(pathname, route.children, route)
      if (found)
        return found
    }
  }

  correctResultFromAction(pathname: string, result: RoutingResult, route: Route, parentRoute?: Route) {
    if (result.redirectTo === undefined && result.customTo === undefined)
      return;

    const parentPath = parentRoute ? parentRoute.path : '/'
    result.redirectTo = Init.to(result.redirectTo, parentPath)
    result.customTo = Init.customTo(result.customTo, parentPath)

    const matching = match(route.path)(pathname)
    if (matching) {
      const pathParams = matching.params
      if (result.redirectTo !== undefined) {
        result.redirectTo = compile(result.redirectTo)(pathParams)
      }
      if (result.customTo) {
        result.customTo.pathname = compile(result.customTo.pathname)(pathParams)
      }
    }
  }

  private log(path: string) {
    if (this.options.isDebug)
      console.log(' ', path)
  }

  static needToMatchChildren({redirectTo, component, children}: Route): boolean {
    return redirectTo === undefined && component === undefined // if 'redirectTo' and 'component' are omitted
      && children !== undefined && children.length > 0         // but children are available
  }

}
