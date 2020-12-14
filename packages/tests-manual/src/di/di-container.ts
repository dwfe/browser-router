import {container} from 'tsyringe'
import {BrowserRouter, IBrowserRouterOptions} from '@do-while-for-each/browser-router'
import {routes} from '../routes'
import {AuthService} from '../pages'
import {CanDeactivateService} from '../pages/CanDeactivate/can-deactivate.service';

const routerOptions: IBrowserRouterOptions = {
  enableTrace: true,
  injectRouteActionsDataToComponent: true,
  pathResolver: {
    enableTrace: true,
  }
}

export const initServices = () => {
  container.register(BrowserRouter, {useValue: new BrowserRouter(routes, routerOptions)}) // singleton
  container.register(AuthService, {useValue: new AuthService()}) // singleton
  container.register(CanDeactivateService, {useValue: new CanDeactivateService()}) // singleton
}
