import {container} from 'tsyringe'
import {Route, RoutingResult} from '@do-while-for-each/path-resolver'
import {Location} from '@do-while-for-each/browser-router'
import React, {ReactElement} from 'react'
import {AuthService, CanDeactivatePage, FirstPage, IndexPage, LoginPage, PicPage, ProtectedByAuthorization, SecondPage} from './pages'
import {Ctx, IRouteNote, NotFoundPage, RouteActionData} from './routing'
import {CanDeactivateService} from './pages/CanDeactivate/can-deactivate.service';


export const routes: Route<ReactElement, Ctx, RoutingResult<ReactElement, Ctx>, IRouteNote>[] = [
  {path: '', component: <IndexPage/>, note: {title: 'Index'}},
  {
    path: 'first', component: <FirstPage/>, note: {title: 'First page'}, children: [
      {path: 'to-pic', customTo: {pathname: '/second/12/pic', search: 'hello=world', hash: 'pic'}},
      {path: '(.*)', redirectTo: '/not-found'},
    ]
  },
  {
    path: 'second', component: <SecondPage/>, note: {title: 'Second page'}, children: [
      {
        path: ':page', children: [
          {path: 'pic', component: <PicPage/>, note: {title: 'Pic'}},
          {path: '(.*)', action: longTimeGettingOfActionResult},
        ]
      },
    ]
  },
  {path: 'protected-by-authorization', canActivate: passIfLoggedIn, component: <ProtectedByAuthorization/>},
  {path: 'can-deactivate-check', canDeactivate: canDeactivateFn, component: <CanDeactivatePage/>},
  {path: 'login', component: <LoginPage/>},
  {path: 'not-found', component: <NotFoundPage/>, note: {title: 'Not found page'}},
  {path: '(.*)', redirectTo: '/not-found'}
]


function longTimeGettingOfActionResult(data: RouteActionData): Promise<RoutingResult<ReactElement, Ctx>> {
  return new Promise(resolve => {
    setTimeout(() => resolve({redirectTo: 'pic'}), 5_000)
  })
}

async function passIfLoggedIn(data: RouteActionData): Promise<RoutingResult<ReactElement, Ctx>> {
  const auth = container.resolve(AuthService)
  if (auth.isLoggedIn())
    return {skip: true}
  else {
    auth.redirectTo = data.target // the user will be redirected here after successful login
    return {redirectTo: 'login'}
  }
}

async function canDeactivateFn(tryRelocation: Location, data: RouteActionData): Promise<boolean> {
  return await container
    .resolve(CanDeactivateService)
    .canDeactivate(tryRelocation, data)
}
