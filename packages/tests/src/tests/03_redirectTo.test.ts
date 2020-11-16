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


  test('redirectTo', () => {
    lengthCheck(flatRoutes, flatPathResolverRoutes, flatRoutesCheck)

    new Traverse().run(flatPathResolverRoutes, (route: Route, totalCount) => {
      if (route.redirectTo === undefined) {
        expect(flatRoutes[totalCount].redirectTo).toBeUndefined()
        expect(flatRoutesCheck[totalCount].redirectTo).toBeUndefined()
      } else {
        // console.log(``,totalCount, flatRoutes[totalCount].redirectTo, route.redirectTo, flatRoutesCheck[totalCount].redirectTo)
        // expect(route.redirectTo).not.toEqual(flatRoutes[totalCount].redirectTo)
        // expect(route.redirectTo).toEqual(flatRoutesCheck[totalCount].redirectTo)
      }
    })
  })
})
