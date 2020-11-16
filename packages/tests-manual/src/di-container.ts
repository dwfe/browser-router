import {container} from 'tsyringe'
import {BrowserRouter, IBrowserRouterOptions} from '@do-while-for-each/browser-router'
import {routes} from './routes'
import {Auth} from './pages'

export const initServices = () => {
  const options: IBrowserRouterOptions = {
    enableTrace: true,
    injectRouteActionsDataToComponent: true,
    pathResolver: {
      enableTrace: false,
    }
  }
  container.register(BrowserRouter, {useValue: new BrowserRouter(routes, options)}) // singleton
  container.register(Auth, {useValue: new Auth()}) // singleton
}
