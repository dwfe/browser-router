import {compile, match} from 'path-to-regexp'
import {ICustomTo, PathResolveResult, Route, Routes, RoutingResult} from './contract'

export class PathResolver {
  routes: Routes = [];

  constructor(routes: Routes) {
    routes.forEach(r => {
      const route: Route = clone(r)

      if (route.path[0] === '/')
        throw errorLeadSlash(route.path)

      // Step 1. All root paths get a prefix '/'
      route.path = '/' + route.path
      route.redirectTo = init.calcTo(route.redirectTo, '/')
      route.customTo = init.calcCustomTo(route.customTo, '/')

      // Step 2. All children paths are obtained as follows:
      //         [full parent path] + '/' + [child path]
      route.children = init.children(route)

      this.routes.push(route)
    })
  }

  resolve(pathname: string): PathResolveResult | undefined {
    return this.find(pathname, this.routes)
  }

  find(pathname: string, routes: Routes | undefined, parentRoute?: Route): PathResolveResult | undefined {
    if (!routes)
      return;

    for (let i = 0; i < routes.length; i++) {
      const route: Route = clone(routes[i])
      const matching = match(route.path)(pathname)
      if (matching && !needToMatchChildren(route)) {
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

    const res: RoutingResult = clone(result)

    const parentPath = parentRoute ? parentRoute.path : '/'
    result.redirectTo = init.calcTo(result.redirectTo, parentPath)
    result.customTo = init.calcCustomTo(result.customTo, parentPath)

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

}

const init = {
  calcTo: (to, parentPath): string | undefined => {
    if (typeof to === 'string') {
      if (to === '')
        return parentPath
      else if (to[0] === '/')
        return to
      else {
        const prefix = parentPath === '/' ? '/' : parentPath + '/'
        return prefix + to
      }
    }
  },
  calcCustomTo: function (to: ICustomTo | undefined, parentPath): ICustomTo | undefined {
    if (to) {
      to.pathname = this.calcTo(to.pathname, parentPath) as string
      return to
    }
  },
  children: function ({path: parentPath, children: routes}: Route): Routes | undefined {
    if (!routes)
      return;

    const children: Routes = []
    for (let i = 0; i < routes.length; i++) {
      const route: Route = clone(routes[i])
      const {path} = route

      if (path[0] === '/')
        throw errorLeadSlash(path)

      children.push(route)

      if (path === '') {
        route.path = parentPath
      } else {
        const prefix = parentPath === '/' ? '' : parentPath
        route.path = prefix + '/' + path
      }
      route.redirectTo = this.calcTo(route.redirectTo, parentPath)
      route.customTo = this.calcCustomTo(route.customTo, parentPath)
      route.children = this.children(route)
    }
    return children
  },
}

const clone = (r: RoutingResult): any => {
  const r2 = {...r}
  if (r2.customTo) {
    r2.customTo = {...r2.customTo}
  }
  return r2
}


const needToMatchChildren = ({redirectTo, component, children}: Route): boolean =>
  redirectTo === undefined && component === undefined // if 'redirectTo' and 'component' are omitted
  && children !== undefined && children.length > 0    // but children are available
;


const errorLeadSlash = (path: string) =>
  new Error(`Invalid configuration of route '${path}': path cannot start with a slash`)
;
