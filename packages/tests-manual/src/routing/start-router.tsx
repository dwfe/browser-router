import {Routes} from '@do-while-for-each/path-resolver'
import {BrowserRouter} from '@do-while-for-each/browser-router'
import React, {ReactElement} from 'react'
import ReactDOM from 'react-dom'
import {container} from 'tsyringe'
import {tap} from 'rxjs/operators'
import {GeneralTemplate} from '../templates/General/GeneralTemplate'

export const startRouter = (routes: Routes, root: HTMLElement | null) => {
  if (!root)
    throw new Error('Root routing element is not defined');

  const router = container.resolve<BrowserRouter<ReactElement>>(BrowserRouter)

  router.componentData$.pipe(
    tap(({component, routeActionData}) => {

      const container =
        <GeneralTemplate>
          {component}
        </GeneralTemplate>;

      ReactDOM.render(container, root)

    }),
  ).subscribe()

  router.start()
}
