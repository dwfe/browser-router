import {compile, match} from 'path-to-regexp'
import {PathResolveResult, Route, Routes} from './contract'

export class PathResolver {
  routes: Routes = [];

  constructor(routes: Routes) {
    routes.forEach(r => {
      const route: Route = {...r} // clone

      if (route.path[0] === '/')
        throw errorLeadSlash(route)

      // Step 1. All root paths get a prefix '/'
      route.path = '/' + route.path
      route.redirectTo = init.redirectTo(route.redirectTo, '/')

      // Step 2. All children paths are obtained as follows:
      //         [full parent path] + '/' + [child path]
      route.children = init.children(route)

      this.routes.push(route)
    })
  }

  resolve(pathname: string): PathResolveResult | undefined {
    return this.find(pathname, this.routes)
  }

  find(pathname: string, routes: Routes | undefined): PathResolveResult | undefined {
    if (!routes)
      return;

    for (let i = 0; i < routes.length; i++) {
      const route = {...routes[i]}
      const matching = match(route.path)(pathname)
      if (matching && !needToMatchChildren(route)) {
        const pathParams = matching.params
        if (route.redirectTo) {
          route.redirectTo = compile(route.redirectTo)(pathParams)
        }
        route.path = pathname
        return {route, pathParams}
      }
      const found = this.find(pathname, route.children)
      if (found)
        return found
    }
  }

}

const init = {
  redirectTo: (redirectTo, parentPath) => {
    if (typeof redirectTo === 'string') {
      if (redirectTo === '')
        return parentPath
      else if (redirectTo[0] === '/')
        return redirectTo
      else {
        const prefix = parentPath === '/' ? '/' : parentPath + '/'
        return prefix + redirectTo
      }
    }
  },
  children: function ({path: parentPath, children: routes}: Route): Routes | undefined {
    if (!routes)
      return;

    const children: Routes = []
    for (let i = 0; i < routes.length; i++) {
      const route = {...routes[i]} // clone
      const {path} = route

      if (path[0] === '/')
        throw errorLeadSlash(route)

      children.push(route)

      if (path === '') {
        route.path = parentPath
      } else {
        const prefix = parentPath === '/' ? '' : parentPath
        route.path = prefix + '/' + path
      }
      route.redirectTo = this.redirectTo(route.redirectTo, parentPath)
      route.children = this.children(route)
    }
    return children
  },
}


const needToMatchChildren = ({redirectTo, component, children}: Route): boolean =>
  redirectTo === undefined && component === undefined // if 'redirectTo' and 'component' are omitted
  && children !== undefined && children.length > 0    // but children are available
;


const errorLeadSlash = (route: Route) =>
  new Error(`Invalid configuration of route '${route.path}': path cannot start with a slash`)
;
