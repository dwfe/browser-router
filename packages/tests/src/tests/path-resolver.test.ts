import {describe, expect} from '@jest/globals'
import {PathResolver, PathResolveResult, Route, Routes} from '@do-while-for-each/path-resolver'

const routes: Routes = [
  {
    path: '', component: '/', children: [
      {path: '', component: '/'},
      {
        path: 'books', component: '/books', children: [
          {path: ':year/:genre', component: '/books/:year/:genre'},
          {path: '(.*)', component: '/books/(.*)', redirectTo: '/auto'}
        ]
      }
    ]
  },
  {
    path: 'team/:id', component: '/team/:id', children: [
      {path: 'group/:gr_id', component: '/team/:id/group/:gr_id'},
      {path: 'users', component: '/team/:id/users'},
      {path: 'user/:name', component: '/team/:id/user/:name'},
      {path: 'hr', component: '/team/:id/hr', redirectTo: ''},
      {path: '(.*)', component: '/team/:id/(.*)', redirectTo: 'users'}
    ]
  },
  {
    path: 'auto', component: '/auto', name: '/auto 1', children: [
      {path: '', component: '/auto', name: '/auto 2',},
      {path: ':color', component: '/auto/:color'},
      {path: 'check/redirect', component: '/auto/check/redirect', redirectTo: 'aqua'}
    ]
  },
]

describe(`tests`, () => {
  const pathResolver = new PathResolver(routes)

  const initTests = () => {
    test(`clone routes and change`, () => {
      traverse(routes, (route: Route) => {
        expect(route.path).not.toEqual(route.component)
      })
    })
    test(`paths construction`, () => {
      traverse(pathResolver.routes, (route: Route) => {
        expect(route.path).toEqual(route.component)
      })
    })
  }

  describe(`init`, initTests)

  test(`resolve`, () => {
    let pathname, res, params;

    pathname = '/some/not-exist'
    res = pathResolver.resolve(pathname)
    expect(res).toBeFalsy()

    pathname = '/books/2020/comics' // '/books/:year/:genre'
    res = pathResolver.resolve(pathname)
    expect(res).toBeTruthy()
    expect((res as PathResolveResult).route.redirectTo).toBeFalsy()
    params = (res as PathResolveResult).pathParams
    expect(params).toBeTruthy()
    expect(Object.keys(params).length).toEqual(2)
    expect(params.year).toEqual('2020')
    expect(params.genre).toEqual('comics')

    pathname = '/books/hello/world/123' // '/books/(.*)'
    res = pathResolver.resolve(pathname)
    expect(res).toBeTruthy()
    expect((res as PathResolveResult).route.redirectTo).toEqual('/auto')

    pathname = '/team/0/group/12' // '/team/:id/group/:gr_id'
    res = pathResolver.resolve(pathname)
    expect(res).toBeTruthy()
    params = (res as PathResolveResult).pathParams
    expect(params).toBeTruthy()
    expect(Object.keys(params).length).toEqual(2)
    expect(params.id).toEqual('0')
    expect(params.gr_id).toEqual('12')

    pathname = '/team/1/hr' // '/team/:id/hr'
    res = pathResolver.resolve(pathname)
    expect(res).toBeTruthy()
    expect((res as PathResolveResult).route.redirectTo).toEqual('/team/1')

    pathname = '/team/7/whatwg' // '/team/:id/(.*)'
    res = pathResolver.resolve(pathname)
    expect(res).toBeTruthy()
    expect((res as PathResolveResult).route.redirectTo).toEqual('/team/7/users')

    pathname = '/auto' // '/auto'
    res = pathResolver.resolve(pathname)
    expect(res).toBeTruthy()
    expect((res as PathResolveResult).route.name).not.toEqual('/auto 2')
    expect((res as PathResolveResult).route.name).toEqual('/auto 1')

    pathname = '/auto/check/redirect' // '/auto/check/redirect'
    res = pathResolver.resolve(pathname)
    expect(res).toBeTruthy()
    expect((res as PathResolveResult).route.redirectTo).toEqual('/auto/aqua')
  })

  describe(`init re-test`, initTests)

  describe(`lead slash`, () => {
    expect(() => {
      new PathResolver([
        {path: ''},
        {path: '/hello'},
      ] as Routes)
    }).toThrowError(new Error(`Invalid configuration of route '/hello': path cannot start with a slash`))

    expect(() => {
      new PathResolver([
        {
          path: 'hello', children: [
            {path: ''},
            {path: '/world'},
          ]
        },
        {path: 'music'},
      ] as Routes)
    }).toThrowError(new Error(`Invalid configuration of route '/world': path cannot start with a slash`))
  })
})

const traverse = (routes: Routes | undefined, fn) => {
  if (!routes)
    return;

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]
    fn(route,)
    traverse(route.children, fn)
  }
}
