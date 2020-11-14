import React, {ReactElement} from 'react'
import {Route, RoutingResult} from '@do-while-for-each/path-resolver'
import {FirstPage, MainPage, PicPage, SecondPage} from './pages';
import {Ctx, IRouteNote, NotFound, RouteActionData} from './routing';


export const routes: Route<ReactElement, Ctx, RoutingResult<ReactElement, Ctx>, IRouteNote>[] = [
  {path: '', component: <MainPage/>, note: {title: 'Index'}},
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
          {
            path: '(.*)', action: (data: RouteActionData) => {
              return new Promise(resolve => {
                setTimeout(()=> resolve({
                  redirectTo: 'pic'
                }), 5_000)
              })
            }
          },
        ]
      },
    ]
  },
  {path: 'not-found', component: <NotFound/>, note: {title: 'Not found page'}},
  {path: '(.*)', redirectTo: '/not-found'}
]

