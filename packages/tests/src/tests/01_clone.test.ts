import {describe, expect} from '@jest/globals'
import {PathResolver, Route} from '@do-while-for-each/path-resolver'
import {routesCheck} from './routes.check'
import {routes} from './routes'
import {routesFlat, Traverse} from '../globals'

describe(`clone`, () => {
  const pathResolver = new PathResolver(routes)

  const _flatRoutes = routesFlat(routes, false)
  const _flatPathResolverRoutes = routesFlat(pathResolver.routes, false)
  const _flatRoutesCheck = routesFlat(routesCheck, false)

  const flatRoutes = routesFlat(routes, true)
  const flatPathResolverRoutes = routesFlat(pathResolver.routes, true)
  const flatRoutesCheck = routesFlat(routesCheck, true)


  test('links', () => {
    expect(_flatRoutes.length).toEqual(_flatPathResolverRoutes.length)
    expect(_flatRoutes.length).toEqual(_flatRoutesCheck.length)
    new Traverse().run(routes, (route: Route, totalCount) => {
      expect(route === _flatRoutes[totalCount]).toBeTruthy()
      expect(route === _flatPathResolverRoutes[totalCount]).toBeFalsy()
    })
  })

  test('path', () => {
    new Traverse().run(flatPathResolverRoutes, (route: Route, totalCount) => {
      expect(route.path).not.toEqual(flatRoutes[totalCount].path)
      expect(route.path).toEqual(flatRoutesCheck[totalCount].path)
    })
  })

  test('redirectTo', () => {
    new Traverse().run(flatPathResolverRoutes, (route: Route, totalCount) => {
      if(route.redirectTo === undefined || (route.redirectTo[0] === '/' && !route.redirectTo.includes(':'))){
        expect(route.redirectTo).toEqual(flatRoutes[totalCount].redirectTo)
        expect(route.redirectTo).toEqual(flatRoutesCheck[totalCount].redirectTo)
      }else {
        // console.log(``,totalCount, flatRoutes[totalCount].redirectTo, route.redirectTo, flatRoutesCheck[totalCount].redirectTo)
        expect(route.redirectTo).not.toEqual(flatRoutes[totalCount].redirectTo)
        expect(route.redirectTo).toEqual(flatRoutesCheck[totalCount].redirectTo)
      }
    })
  })
})
