import {Routes} from '@do-while-for-each/path-resolver';
import {BrowserRouter, IBrowserRouterOptions} from '@do-while-for-each/browser-router';
import {ReactElement} from 'react';
import ReactDOM from 'react-dom';
import {container} from 'tsyringe'
import {tap} from 'rxjs/operators'

export const startRouter = (routes: Routes, root: HTMLElement | null) => {
  if (!root)
    throw new Error('Root routing element is not defined');

  const options: IBrowserRouterOptions = {
    enableTrace: true,
    injectRouteActionsDataToComponent: true,
    pathResolver: {
      enableTrace: false,
    }
  }
  container.register(BrowserRouter, {useValue: new BrowserRouter(routes, options)})
  const router = container.resolve<BrowserRouter<ReactElement>>(BrowserRouter)

  router.component$.pipe(
    tap(component => {
      ReactDOM.render(
        component,
        root
      )
    }),
  ).subscribe()

  router.start()
}
