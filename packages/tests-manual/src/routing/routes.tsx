import React, {ReactElement} from 'react'
import {Route, RoutingResult} from '@do-while-for-each/path-resolver'
import {FirstPage, MainPage, PicPage, SecondPage} from '../pages';
import {NotFound} from './components/NotFound';
import {Ctx, IRouteNote, RouteActionData} from './contract';


export const routes: Route<ReactElement, Ctx, RoutingResult<ReactElement, Ctx>, IRouteNote>[] = [
  {path: '', component: <MainPage/>},
  {
    path: 'first', children: [
      {path: '', customTo: {pathname: '/second/pic'}, component: <FirstPage/>},
      {path: '(.*)', action: notFoundHandler},
    ]
  },
  {
    path: 'second', component: <SecondPage/>, children: [
      {path: 'pic', component: <PicPage/>},
      {path: '(.*)', action: notFoundHandler},
    ]
  },
  {
    path: 'not-found', action: async (data: RouteActionData) => ({
      component: <NotFound routeActionData={data}/>
    })
  },
  {path: '(.*)', action: notFoundHandler, note: {title: `route.note.title = 404`}}
]


async function notFoundHandler(data: RouteActionData): Promise<RoutingResult<ReactElement, Ctx>> {
  return {
    customTo: {
      pathname: '/not-found',
      // search: '?qwerty=123',
      // hash: '#star',
      isRedirect: true,
      actionData: data
    },
  }
}
