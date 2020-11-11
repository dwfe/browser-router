import React, {ReactElement} from 'react'
import {IActionData, Route} from '@do-while-for-each/path-resolver'
import {FirstPage, MainPage, PicPage, SecondPage} from '../pages';
import {NotFound} from './components/NotFound';

const notFoundHandler = async (data: RouteActionData) => ({
  component: <NotFound routeActionData={data}/>
})

export const routes: Route<ReactElement, IRouteContext>[] = [
  {path: '', component: <MainPage/>},
  {
    path: 'first', children: [
      {path: '', component: <FirstPage/>},
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
    path: '(.*)', action: notFoundHandler
  }
]

export interface IRouteContext {
  title: string;
}

export type RouteActionData = IActionData<IRouteContext | any>

