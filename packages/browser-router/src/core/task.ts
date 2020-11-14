import {IActionData, PathResolver, PathResolveResult, Route, RouteContext, RoutingResult} from '@do-while-for-each/path-resolver'
import {Location} from 'history'
import {addFirstSymbol, excludeFirstSymbol, getUrl} from '../globals'
import {BrowserRouter} from './browser-router'
import {IBrowserRouterOptions} from './contract'
import React = require('react')


export class Task<TComponent = any,
  TContext extends RouteContext = RouteContext,
  TActionResult extends RoutingResult<TComponent, TContext> = RoutingResult<TComponent, TContext>,
  TNote = any> {

  readonly route: Route<TComponent, TContext, TActionResult, TNote>
  readonly parentRoute: Route<TComponent, TContext, TActionResult, TNote>
  readonly routeActionData: IActionData<TContext>
  isCanceled = false
  result: any

  constructor(public readonly id: string,
              public readonly location: Location<TContext>,
              private resolved: PathResolveResult,
              private router: BrowserRouter<TComponent, TContext, TActionResult, TNote>) {
    this.route = resolved.route as Route<TComponent, TContext, TActionResult, TNote>
    this.parentRoute = resolved.parentRoute as Route<TComponent, TContext, TActionResult, TNote>
    this.routeActionData = this.getRouteActionData()
  }

  runLifecycle = async (): Promise<Task<TComponent, TContext, TActionResult, TNote>> =>
    this.stageProcessResult(this.route)
      .then(() => this.stageInvokeRouteAction())
      .then(() => this.stageSummarize())
  ;

  private async stageProcessResult({redirectTo, customTo, component}: RoutingResult<TComponent>) {
    if (this.isCompleted())
      return;
    this.trace('process result')
    const stage = '->'

    const context_for_To_or_Go = {previousActionData: this.routeActionData} as RouteContext as TContext
    if (redirectTo) {
      this.result = () => {
        this.trace(`${stage} redirectTo`)
        this.router.redirect(redirectTo, context_for_To_or_Go)
      }
      return;
    } else if (customTo) {
      let {pathname, search, hash, isRedirect} = customTo
      search = addFirstSymbol('?', search)
      hash = addFirstSymbol('#', hash)
      const to = {pathname, search, hash}
      isRedirect = isRedirect === undefined || isRedirect === true
      this.result = isRedirect
        ? () => {
          this.trace(`${stage} redirectTo`)
          this.router.redirect(to, context_for_To_or_Go)
        }
        : () => {
          this.trace(`${stage} goTo`)
          this.router.go(to, context_for_To_or_Go)
        }
      return;
    } else if (component) {
      component = this.injectRoutingProps(component)
      this.result = () => {
        this.trace(`${stage} component`)
        this.router.componentSubj.next(component)
      }
      return;
    }
    this.trace(`  unprocessed`)
  }

  private async stageInvokeRouteAction() {
    if (this.isCompleted() || !this.route.action)
      return;
    const stage = 'invoke route action'
    this.trace(stage)

    let actionResult: TActionResult
    try {
      actionResult = await this.route.action(this.routeActionData) as TActionResult
    } catch (e) {
      throw new Error(`Error in route action(...) for [ ${this.id} ]. ${e}`)
    }
    this.pathResolver.correctResultFromAction(this.location.pathname, actionResult, this.route, this.parentRoute)
    await this.stageProcessResult(actionResult)
    if (!this.isCompleted()) {
      // If the route action does not return one of {redirectTo / customTo / component},
      // so here you need to send the actionResult to the waiting listeners,
      // but why anyone would want to do that - I can't think of a single case...
      this.isCanceled = true
      this.trace(`${stage} -> unknown result`)
    }
    return;
  }

  private async stageSummarize(): Promise<Task<TComponent, TContext, TActionResult, TNote>> {
    this.trace('location processed')
    if (!this.isCompleted())
      throw new Error(`Impossible to process of resolved route for [ ${this.id} ]`)
    return this
  }


//region Handlers

  static id = (location: Location): string => getUrl(location)

  private isCompleted(): boolean {
    if (!this.isCanceled)
      this.isCanceled = this.location.key !== this.lastLocationKey
    return this.isCanceled || this.result
  }

  private getRouteActionData(): IActionData<TContext> {
    let {pathname, search, hash, state, key} = this.location
    const previous = state?.previousActionData as IActionData<TContext>
    if (previous) {
      delete state?.previousActionData
      if (state && Object.keys(state as object).length === 0) {
        state = null as TContext
      }
    }
    return {
      target: {
        pathname,
        pathParams: this.resolved.pathParams,
        search: excludeFirstSymbol('?', search),
        hash: excludeFirstSymbol('#', hash),
      },
      ctx: state,
      note: this.route.note,
      previous,
      key,
    }
  }

  private injectRoutingProps(component): any {
    if (!this.options.injectRouteActionsDataToComponent)
      return component

    if (typeof component === 'object') {
      this.trace('  inject routing props to component')
      const props = {routeActionData: this.routeActionData}
      if (component.props) { // condition that component is React component
        return React.cloneElement(
          component as any,
          props
        )
      }
      // else if() {}        // condition and inject for component in Your case
    }
    return component
  }

  private get lastLocationKey(): string {
    return this.router.lastLocationKey
  }

  private get options(): IBrowserRouterOptions {
    return this.router.options
  }

  private get pathResolver(): PathResolver {
    return this.router.pathResolver
  }

  private trace(stage: string) {
    this.router.trace(this.id, stage)
  }

//endregion

}
