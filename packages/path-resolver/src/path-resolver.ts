import {compile, match} from 'path-to-regexp'
import {ICustomTo, PathResolveResult, Route, Routes} from './contract'

export class PathResolver {
  routes: Routes = [];

  constructor(routes: Routes) {
    routes.forEach(r => {
      const route: Route = {...r} // clone

      if (route.path[0] === '/')
        throw errorLeadSlash(route)

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
      route.redirectTo = this.calcTo(route.redirectTo, parentPath)
      route.customTo = this.calcCustomTo(route.customTo, parentPath)
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
