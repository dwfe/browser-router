import {BrowserRouter} from '@do-while-for-each/browser-router'
import React, {ReactElement} from 'react'
import {container} from 'tsyringe'
import ReactDOM from 'react-dom'
import {defaultRouteResultHandlerOptions, IRouteResultHandlerOptions, TRouteResultArg} from './contract'
import {GeneralTemplate} from '../app/templates/General/GeneralTemplate'

export class RouteResultsHandler {

  private router: BrowserRouter
  private unlistenFn!: () => void

  constructor(private root: HTMLElement | null,
              private options: IRouteResultHandlerOptions = defaultRouteResultHandlerOptions) {
    this.router = container.resolve(BrowserRouter)
  }

  start() {
    this.unlistenFn = this.router.resultListeners.push(this.onRouteResult.bind(this));
    this.router.start()
  }

  stop() {
    this.unlistenFn?.()
  }

  private onRouteResult(arg: TRouteResultArg) {
    const component = this.injectProps(arg);
    ReactDOM.render(
      <GeneralTemplate>
        {component}
      </GeneralTemplate>,
      this.root
    )
  }

  private injectProps({component, routeActionData}: TRouteResultArg): ReactElement {
    if (!this.options.injectRouteActionsDataToComponent)
      return component;
    return React.isValidElement(component)
      ? React.cloneElement(component as any, {routeActionData})
      : component;
  }

}
