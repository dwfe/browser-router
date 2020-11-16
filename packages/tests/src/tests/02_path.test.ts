import {describe, expect} from '@jest/globals'
import {PathResolver, Route} from '@do-while-for-each/path-resolver'
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
      expect(route.path).not.toEqual(flatRoutes[totalCount].path)
      expect(route.path).toEqual(flatRoutesCheck[totalCount].path)
    })
  })

})
