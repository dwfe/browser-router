import {BrowserRouter} from '@do-while-for-each/browser-router'
import {Routes} from '@do-while-for-each/path-resolver'
import React, {ReactElement} from 'react'
import ReactDOM from 'react-dom'
import {container} from 'tsyringe'
import {GeneralTemplate} from '../templates/General/GeneralTemplate'
import {TRouteResultArg} from './contract'

export const startRouter = (routes: Routes, root: HTMLElement | null) => {
  if (!root)
    throw new Error('Root routing element is not defined');

  const router = container.resolve<BrowserRouter<ReactElement>>(BrowserRouter)
  const unlistenFn = router.resultListeners.push(
    ({component, routeActionData}: TRouteResultArg) => {
      ReactDOM.render(
        <GeneralTemplate>
          {component}
        </GeneralTemplate>
        , root)
    }
  )
  router.start()
  return unlistenFn
}
