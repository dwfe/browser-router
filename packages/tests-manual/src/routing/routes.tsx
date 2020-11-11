import React, {ReactElement} from 'react'
import {Route, RoutingResult} from '@do-while-for-each/path-resolver'
import {FirstPage, MainPage, PicPage, SecondPage} from '../pages';
import {NotFound} from './components/NotFound';
import {IRouteContext, IRouteNote, RouteActionData} from './contract';


export const routes: Route<ReactElement, IRouteContext, RoutingResult<ReactElement>, IRouteNote>[] = [
  {path: '', component: <MainPage/>},
  {
    path: 'first', children: [
      {path: '', component: <FirstPage/>},
      {path: '(.*)', action: notFoundAction},
    ]
  },
  {
    path: 'second', component: <SecondPage/>, children: [
      {path: 'pic', component: <PicPage/>},
      {path: '(.*)', action: notFoundAction},
    ]
  },
  {path: '(.*)', action: notFoundAction, note: {title: `route.note.title = 404`}}
]


async function notFoundAction(data: RouteActionData): Promise<RoutingResult<ReactElement>> {
  return {
    component: <NotFound routeActionData={data}/>
  }
}
