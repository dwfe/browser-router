import {describe, expect} from '@jest/globals'
import {init, PathResolver, Route} from '@do-while-for-each/path-resolver'
import {routesCheck} from './routes.check'
import {routes} from './routes'
import {routesFlat, Traverse} from '../globals'
import {lengthCheck} from './common'

describe(`path`, () => {
  const pathResolver = new PathResolver(routes)
  const flatRoutes = routesFlat(routes, true)
  const flatPathResolverRoutes = routesFlat(pathResolver.routes, true)
  const flatRoutesCheck = routesFlat(routesCheck, true)

  test('.', () => {
    lengthCheck(flatRoutes, flatPathResolverRoutes, flatRoutesCheck)

    new Traverse().run(flatPathResolverRoutes, (route: Route, totalCount) => {
      // [path] routes !== pathResolver.routes
      expect(route.path).not.toEqual(flatRoutes[totalCount].path)

      // [path] routes + init.calcPath === pathResolver.routes
      const parentRoute = flatRoutesCheck[totalCount]['parentRoute']
      const parentPath = parentRoute === null ? '/' : parentRoute.path
      expect(route.path).toEqual(init.calcPath(flatRoutes[totalCount].path, parentPath))

      // [path] routesCheck === pathResolver.routes
      expect(route.path).toEqual(flatRoutesCheck[totalCount].path)
    })
  })

})
