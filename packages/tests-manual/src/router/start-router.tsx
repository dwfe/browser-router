import {BrowserRouter} from '@do-while-for-each/browser-router'
import {IRoute} from '@do-while-for-each/path-resolver'
import React from 'react'
import ReactDOM from 'react-dom'
import {container} from 'tsyringe'
import {GeneralTemplate} from '../app/templates/General/GeneralTemplate'
import {TRouteResultArg} from './contract'

export const startRouter = (routes: IRoute[], root: HTMLElement | null) => {
  if (!root)
    throw new Error('Root routing element is not defined');

  const router = container.resolve(BrowserRouter)
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
