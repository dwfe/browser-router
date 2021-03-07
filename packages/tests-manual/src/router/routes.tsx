import {IActionResult, IRoute} from '@do-while-for-each/path-resolver'
import {Location} from '@do-while-for-each/browser-router'
import {NotFoundPage} from '@do-while-for-each/browser-router-react-tools'
import React, {ReactElement} from 'react'
import {container} from 'tsyringe'
import {AuthService, CanDeactivatePage, FirstPage, IndexPage, LoginPage, PicPage, ProtectedByAuthorization, SecondPage} from '../app/pages'
import {CanDeactivateService} from '../app/pages/CanDeactivate/can-deactivate.service'
import {IRouteNote, TCtx, TRouteActionData} from './index'

export const routes: IRoute<ReactElement, IRouteNote, IActionResult<ReactElement>, TCtx>[] = [
  {path: '', component: <IndexPage/>, note: {title: 'Index'}},
  {
    path: 'first', component: <FirstPage/>, note: {title: 'First page'}, children: [
      {path: 'to-pic', customTo: {pathname: '/second/12/picture', search: 'hello=world', hash: 'pic'}},
      {path: '(.*)', redirectTo: '/not-found'},
    ]
  },
  {
    path: 'second', component: <SecondPage/>, note: {title: 'Second page'}, children: [
      {
        path: ':page', children: [
          {path: 'picture', component: <PicPage/>, note: {title: 'Picture'}},
          {path: '(.*)', action: longTimeGettingOfActionResult},
        ]
      },
    ]
  },
  {path: 'protected-by-authorization', component: <ProtectedByAuthorization/>, canActivate: passIfLoggedIn},
  {path: 'can-deactivate-check', component: <CanDeactivatePage/>, canDeactivate: canDeactivateFn},
  {path: 'login', component: <LoginPage/>},
  {path: 'not-found', component: <NotFoundPage/>, note: {title: 'Not found page'}},
  {path: '(.*)', redirectTo: '/not-found'}
]


function longTimeGettingOfActionResult(data: TRouteActionData): Promise<IActionResult> {
  return new Promise(resolve => {
    setTimeout(() => resolve({redirectTo: 'picture'}), 5_000)
  })
}

function passIfLoggedIn(data: TRouteActionData): Promise<IActionResult> {
  return container.resolve(AuthService).passIfLoggedIn(data)
}

function canDeactivateFn(tryRelocation: Location<TCtx>, data: TRouteActionData): Promise<boolean> {
  return container.resolve(CanDeactivateService).canDeactivate(tryRelocation, data)
}

