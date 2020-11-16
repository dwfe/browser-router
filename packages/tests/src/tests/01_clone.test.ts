import {describe, expect} from '@jest/globals'
import {PathResolver, Route} from '@do-while-for-each/path-resolver'
import {routesCheck} from './routes.check'
import {routes} from './routes'
import {removeChildren, routesFlat, traverse, Traverse} from '../globals'

describe(`clone`, () => {
  const pathResolver = new PathResolver(routes)
  const flatRoutes = routesFlat(routes)
  const flatPathResolverRoutes = routesFlat(pathResolver.routes)
  const flatRoutesCheck = routesFlat(routesCheck)


  test('pre-checks', () => {

    expect(flatRoutes.length).toEqual(flatPathResolverRoutes.length)

    expect(flatRoutes.length).toEqual(flatRoutesCheck.length)

    new Traverse().run(routes, (route: Route, i) => {
      console.log(``,i, route)
      console.log(``,i, flatRoutes[i])
      expect(route === flatRoutes[i]).toBeTruthy()
    })

    new Traverse().run(routes, (route: Route, i) => {
      expect(route === flatPathResolverRoutes[i]).toBeFalsy()
    })

  })

  test('path', () => {
    removeChildren(flatRoutes)
    removeChildren(flatPathResolverRoutes)
    removeChildren(flatRoutesCheck)
    console.log(``, JSON.stringify(flatPathResolverRoutes, null,2))
    new Traverse().run(flatPathResolverRoutes, (route: Route, i) => {
      console.log(``,i, flatRoutes[i].path, route.path, flatRoutesCheck[i].path)
      expect(route.path).not.toEqual(flatRoutes[i].path)
      expect(route.path).toEqual(flatRoutesCheck[i].path)
    })


  })
})
