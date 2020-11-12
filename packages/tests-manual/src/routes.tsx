import React, {ReactElement} from 'react'
import {Route, RoutingResult} from '@do-while-for-each/path-resolver'
import {FirstPage, MainPage, PicPage, SecondPage} from './pages';
import {NotFound} from './routing/components/NotFound';
import {Ctx, IRouteNote} from './routing';


export const routes: Route<ReactElement, Ctx, RoutingResult<ReactElement, Ctx>, IRouteNote>[] = [
  {path: '', component: <MainPage/>, note: {title: 'Index'}},
  {
    path: 'first', component: <FirstPage/>, note: {title: 'First page'}, children: [
      {path: 'to-pic', customTo: {pathname: '/second/pic', search: 'hello=world', hash: 'pic'}},
      {path: '(.*)', redirectTo: '/not-found'},
    ]
  },
  {
    path: 'second', component: <SecondPage/>, note: {title: 'Second page'}, children: [
      {path: 'pic', component: <PicPage/>, note: {title: 'Pic'}},
      {path: '(.*)', redirectTo: '/not-found'},
    ]
  },
  {path: 'not-found', component: <NotFound/>, note: {title: 'Not found page'}},
  {path: '(.*)', redirectTo: '/not-found'}
]

