import {compile, match as matcher, MatchResult} from 'path-to-regexp'
import {defaultOptions, IActionResult, IPathResolveResult, IRoute, TPathParams} from './contract'
import {Clone} from './clone'
import {Init} from './init'

export class PathResolver {
  routes: IRoute[] = [];

  constructor(routes: IRoute[],
              public options = defaultOptions) {
    this.routes = routes.map(route => Init.route(route, '/'))
  }

  resolve(pathname: string): IPathResolveResult | undefined {
    this.log(`resolving '${pathname}'`)
    return this.find(pathname, this.routes)
  }

  find(pathname: string, routes: IRoute[] | undefined, parentRoute?: IRoute): IPathResolveResult | undefined {
    if (!routes) return;

    for (let i = 0; i < routes.length; i++) {
      let route = routes[i]

      if (PathResolver.isWrongBranchByFirst(route.path, pathname)) {
        this.log(`[x] ${route.path}, wrong branch`)
        continue;
      }

      const match: MatchResult<TPathParams> | false = matcher<TPathParams>(route.path)(pathname)
      this.log(`[${match ? 'v' : 'x'}] ${route.path}`)

      if (match && !PathResolver.needToMatchChildren(route)) {
        route = Clone.route(route)
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

  correctResultFromAction(pathname: string, result: IActionResult, route: IRoute, parentRoute?: IRoute) {
    if (result.redirectTo === undefined && result.customTo === undefined)
      return;

    const parentPath = parentRoute ? parentRoute.path : '/'
    result.redirectTo = Init.to(result.redirectTo, parentPath)
    result.customTo = Init.customTo(result.customTo, parentPath)

    const match: MatchResult<TPathParams> | false = matcher<TPathParams>(route.path)(pathname)
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

  static needToMatchChildren({redirectTo, component, children}: IRoute): boolean {
    return redirectTo === undefined && component === undefined // if 'redirectTo' and 'component' are omitted
      && children !== undefined && children.length > 0         // but children are available
  }

  static isWrongBranchByFirst(src: string, toCheck: string): boolean {
    const srcFirst = src.split('/')[1] // check only first level: '/this'
    const start = srcFirst[0];
    if (start === undefined || start === ':' || start === '(') // can't check -> is not wrong -> check or go inside branch
      return false;
    const checkFirst = toCheck.split('/')[1]
    return srcFirst !== checkFirst;
  }

  private log(path: string) {
    if (this.options.isDebug)
      console.log(' ', path)
  }

}
