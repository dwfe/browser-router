import {describe, expect} from '@jest/globals'
import {PathResolver, Route} from '@do-while-for-each/path-resolver'
import {routesCheck} from './routes.check'
import {routes} from './routes'
import {routesFlat, Traverse} from '../globals'
import {lengthCheck} from './common'

describe(`clone`, () => {
  const pathResolver = new PathResolver(routes)
  const flatRoutes = routesFlat(routes, false)
  const flatPathResolverRoutes = routesFlat(pathResolver.routes, false)
  const flatRoutesCheck = routesFlat(routesCheck, false)

  test('test', () => {
    lengthCheck(flatRoutes, flatPathResolverRoutes, flatRoutesCheck)

    new Traverse().run(routes, (route: Route, totalCount) => {
      expect(route === flatRoutes[totalCount]).toBeTruthy()
      expect(route === flatPathResolverRoutes[totalCount]).toBeFalsy()

      if (route.customTo === undefined){
        expect(flatRoutes[totalCount].customTo).toBeUndefined()
        expect(flatPathResolverRoutes[totalCount].customTo).toBeUndefined()
      }else {
        expect(route.customTo === flatRoutes[totalCount].customTo).toBeTruthy()
        expect(route.customTo === flatPathResolverRoutes[totalCount].customTo).toBeFalsy()
      }
    })
  })

})
