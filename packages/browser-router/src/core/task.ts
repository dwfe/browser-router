import {IActionData, PathResolver, PathResolveResult, Route, RouteContext, RoutingResult} from '@do-while-for-each/path-resolver'
import {Blocker, Location, PartialPath, Transition} from 'history'
import React from 'react'
import {addFirstSymbol, createPathStr, excludeFirstSymbol} from '../globals'
import {BrowserRouter} from './browser-router'
import {IBrowserRouterOptions} from './contract'


export class Task<TComponent = any,
  TContext extends RouteContext = RouteContext,
  TActionResult extends RoutingResult<TComponent, TContext> = RoutingResult<TComponent, TContext>,
  TNote = any> {

  static id = (p: PartialPath): string => createPathStr(p)

  readonly route: Route<TComponent, TContext, TActionResult, TNote>
  readonly parentRoute: Route<TComponent, TContext, TActionResult, TNote>
  readonly routeActionData: IActionData<TContext>
  isCanceled = false // the task can be canceled if the user changed the location while the current one was being processed
  result: any // task result is either a redirect to another location, or a component for rendering

  private unblockNavigationFn: any // unblock function if 'canDeactivate' action is defined

  constructor(public readonly id: string,
              public readonly location: Location<TContext>,
              private resolved: PathResolveResult,
              private router: BrowserRouter<TComponent, TContext, TActionResult, TNote>) {
    this.route = resolved.route as Route<TComponent, TContext, TActionResult, TNote>
    this.parentRoute = resolved.parentRoute as Route<TComponent, TContext, TActionResult, TNote>
    this.routeActionData = this.getRouteActionData()
  }

  runLifecycle = (): Promise<Task<TComponent, TContext, TActionResult, TNote>> =>
    this.stageCanActivate()
      .then(() => this.blockNavigation()) // if 'canDeactivate' action is defined
      .then(() => this.stageProcessResult(this.route))
      .then(() => this.stageInvokeRoutesAction())
      .then(() => this.stageSummarize())
      .catch(err => {
        this.unblockNavigation()
        throw err
      })
  ;

  isCompleted(): boolean {
    if (!this.isCanceled)
      this.isCanceled = !this.router.isSameLocation(this.location)
    return this.isCanceled || !!this.result
  }

  private async stageCanActivate(): Promise<void> {
    if (this.isCompleted() || !this.route.canActivate)
      return;
    const stage = `invoke 'canActivate' action`
    this.trace(stage)
    await this.invokeAction(this.route.canActivate, 'canActivate', stage)
  }

  private async stageProcessResult({redirectTo, customTo, component, skip}: RoutingResult<TComponent>): Promise<boolean | undefined> {
    if (this.isCompleted())
      return;
    this.trace('process result')
    const stage = '->'

    if (skip) {
      this.trace(`${stage} go to the next stage`)
      return skip
    }

    const context_for_RedirectTo_or_Goto = {previousActionData: this.routeActionData} as RouteContext as TContext
    if (redirectTo) {
      this.result = () => {
        this.trace(`${stage} redirectTo`)
        this.router.redirect(redirectTo, context_for_RedirectTo_or_Goto)
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
          this.router.redirect(to, context_for_RedirectTo_or_Goto)
        }
        : () => {
          this.trace(`${stage} goto`)
          this.router.goto(to, context_for_RedirectTo_or_Goto)
        }
      return;
    } else if (component) {
      component = this.injectRoutingProps(component)
      this.result = () => {
        this.trace(`${stage} component`)
        this.router.componentSubj.next({
          component: component as TComponent,
          routeActionData: this.routeActionData
        })
      }
      return;
    }
    this.trace(`  unprocessed`)
  }

  private async stageInvokeRoutesAction(): Promise<void> {
    if (this.isCompleted() || !this.route.action)
      return;
    const stage = `invoke 'action'`
    this.trace(stage)
    await this.invokeAction(this.route.action, 'action', stage)
  }

  private async stageSummarize(): Promise<Task<TComponent, TContext, TActionResult, TNote>> {
    this.trace('location processed')
    if (!this.isCompleted())
      throw new Error(`Impossible to process of resolved route for [ ${this.id} ]`)
    return this
  }


//region Handlers

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
      if (React.isValidElement(component)) {
        return React.cloneElement(
          component as any,
          props
        )
      }
      // else if() {}        // condition and inject for component in Your case
    }
    return component
  }

  private async invokeAction(action: (data: IActionData<TContext, TNote>) => Promise<TActionResult>, name: string, stage: string): Promise<void> {
    let actionResult: TActionResult
    try {
      actionResult = await action(this.routeActionData) as TActionResult
    } catch (e) {
      throw new Error(`Error in route ${name}(...) for [ ${this.id} ]. ${e}`)
    }
    this.pathResolver.correctResultFromAction(this.location.pathname, actionResult, this.route, this.parentRoute)
    const skip = await this.stageProcessResult(actionResult)
    if (!skip && !this.isCompleted()) {
      // If the route action does not return one of {redirectTo / customTo / component},
      // so here you need to send the actionResult to the waiting listeners,
      // but why anyone would want to do that - I can't think of a single case...
      this.isCanceled = true
      this.trace(`${stage} -> unknown result`)
    }
  }

//endregion

//region CanDeactivate

  private async blockNavigation(): Promise<void> {
    const canDeactivate = this.route.canDeactivate
    if (this.isCompleted() || !canDeactivate)
      return;
    this.trace(`block navigation out from [ ${this.id} ]`)

    const routeActionData = this.getRouteActionData()

    /**
     *  https://github.com/ReactTraining/history/blob/master/docs/blocking-transitions.md
     */
    const blockHandler: Blocker = async (tx: Transition<TContext>) => {
      try {
        this.trace(`invoke 'canDeactivate' action`)
        const pass = await canDeactivate(tx.location, routeActionData)
        this.trace(`${pass ? 'can' : 'cannot'} be deactivated to [ ${Task.id(tx.location)} ]`)
        if (pass) {
          this.unblockNavigation()
          tx.retry()
        }
      } catch (e) {
        this.unblockNavigation()
        throw new Error(`Error in route 'canDeactivate' action for [ ${this.id} ]. ${e}`)
      }
    }
    this.unblockNavigationFn = this.router.block(blockHandler)
  }

  private unblockNavigation() {
    if (!this.unblockNavigationFn)
      return;
    this.unblockNavigationFn()
    this.unblockNavigationFn = null
    this.trace('unblock navigation')
  }

//endregion

//region Utils

  private get options(): IBrowserRouterOptions {
    return this.router.options
  }

  private get pathResolver(): PathResolver {
    return this.router.pathResolver
  }

  private trace(text: string) {
    this.router.trace(this.id, text)
  }

//endregion

}
