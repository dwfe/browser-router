import {BrowserRouter, IBrowserRouterOptions} from '@do-while-for-each/browser-router'
import {container} from 'tsyringe'
import {CanDeactivateService} from './app/pages/CanDeactivate/can-deactivate.service'
import {AuthService} from './app/pages'
import {routes} from './router/routes'

export class DI {

  static init(): void {
    const routerOptions: IBrowserRouterOptions = {
      isDebug: true,
      injectRouteActionsDataToComponent: true,
      pathResolver: {
        isDebug: true,
      }
    }
    const router = new BrowserRouter(routes, routerOptions)

    container.register(BrowserRouter, {useValue: router}) // singleton
    container.register(AuthService, {useValue: new AuthService(router)}) // singleton
    container.register(CanDeactivateService, {useValue: new CanDeactivateService()}) // singleton
  }

}

