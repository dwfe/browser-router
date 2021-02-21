import {BrowserRouter, IBrowserRouterOptions} from '@do-while-for-each/browser-router'
import {container} from 'tsyringe'
import {CanDeactivateService} from '../pages/CanDeactivate/can-deactivate.service'
import {AuthService} from '../pages'
import {routes} from '../routes'

const routerOptions: IBrowserRouterOptions = {
  isDebug: true,
  injectRouteActionsDataToComponent: true,
  pathResolver: {
    isDebug: true,
  }
}

export const initServices = () => {
  container.register(BrowserRouter, {useValue: new BrowserRouter(routes, routerOptions)}) // singleton
  container.register(AuthService, {useValue: new AuthService()}) // singleton
  container.register(CanDeactivateService, {useValue: new CanDeactivateService()}) // singleton
}
