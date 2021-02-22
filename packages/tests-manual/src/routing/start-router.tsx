import {BrowserRouter, IListenersData} from '@do-while-for-each/browser-router'
import {IActionData, Routes} from '@do-while-for-each/path-resolver'
import React, {ReactElement} from 'react'
import ReactDOM from 'react-dom'
import {container} from 'tsyringe'
import {GeneralTemplate} from '../templates/General/GeneralTemplate'
import {Ctx, IRouteNote} from './contract'

export const startRouter = (routes: Routes, root: HTMLElement | null) => {
  if (!root)
    throw new Error('Root routing element is not defined');

  const router = container.resolve<BrowserRouter<ReactElement>>(BrowserRouter)
  const unsubscribeFn = router.listeners.push(
    ({component, routeActionData}: IListenersData<ReactElement, IActionData<IRouteNote, Ctx>>) => {
      ReactDOM.render(
        <GeneralTemplate>
          {component}
        </GeneralTemplate>
        , root)
    }
  )
  router.start()

  return unsubscribeFn
}
