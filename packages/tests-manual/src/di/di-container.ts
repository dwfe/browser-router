import {container} from 'tsyringe'
import {BrowserRouter, IBrowserRouterOptions} from '@do-while-for-each/browser-router'
import {routes} from '../routes'
import {AuthService} from '../pages'

export const initServices = () => {
  const options: IBrowserRouterOptions = {
    enableTrace: true,
    injectRouteActionsDataToComponent: true,
    pathResolver: {
      enableTrace: true,
    }
  }
  container.register(BrowserRouter, {useValue: new BrowserRouter(routes, options)}) // singleton
  container.register(AuthService, {useValue: new AuthService()}) // singleton
}
