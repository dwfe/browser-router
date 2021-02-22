import {IActionData, IActionResult, IPath, PathResolver, PathResolveResult, Route, RouteContext} from '@do-while-for-each/path-resolver'
import {Blocker, Location, Transition} from 'history'
import React from 'react'
import {IBrowserRouterOptions} from './contract'
import {BrowserRouter} from './browser-router'
import {Path} from './path'

export class Task<TComponent = any,
  TContext extends RouteContext = RouteContext,
  TActionResult extends IActionResult<TComponent> = IActionResult<TComponent>,
  TNote = any> {

  static id = (path: IPath): string => Path.of(path).toString()

  route: Route<TComponent, TContext, TActionResult, TNote>
  parentRoute: Route<TComponent, TContext, TActionResult, TNote>
  routeActionData: IActionData<TContext>
  isCanceled = false // task can be canceled if the user changed the location while the current one was being processed
  result: () => void // task result is either a redirect to another location or a component for rendering

  private unblockNavigationFn: any // unblock function if 'canDeactivate' action is defined

  constructor(public id: string,
              public location: Location<TContext>,
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
    this.log(stage)
    await this.invokeAction(this.route.canActivate, 'canActivate', stage)
  }

  private async stageProcessResult({redirectTo, customTo, component, skip}: IActionResult<TComponent>): Promise<boolean | undefined> {
    if (this.isCompleted())
      return;
    this.log('process result')
    const stage = '->'

    if (skip) {
      this.log(`${stage} go to the next stage`)
      return skip
    }

    const context_for_RedirectTo_or_Goto = {previousActionData: this.routeActionData} as RouteContext as TContext
    if (redirectTo) {
      this.result = () => {
        this.log(`${stage} redirectTo`)
        this.router.redirect(redirectTo, context_for_RedirectTo_or_Goto)
      }
      return;
    } else if (customTo) {
      let {isRedirect} = customTo
      isRedirect = isRedirect === undefined || isRedirect === true
      this.result = isRedirect
        ? () => {
          this.log(`${stage} redirectTo`)
          this.router.redirect(customTo, context_for_RedirectTo_or_Goto)
        }
        : () => {
          this.log(`${stage} goto`)
          this.router.goto(customTo, context_for_RedirectTo_or_Goto)
        }
      return;
    } else if (component) {
      component = this.injectRoutingProps(component)
      this.result = () => {
        this.log(`${stage} component`)
        this.router.componentSubj.next({
          component: component as TComponent,
          routeActionData: this.routeActionData
        })
      }
      return;
    }
    this.log(`  unprocessed`)
  }

  private async stageInvokeRoutesAction(): Promise<void> {
    if (this.isCompleted() || !this.route.action)
      return;
    const stage = `invoke 'action'`
    this.log(stage)
    await this.invokeAction(this.route.action, 'action', stage)
  }

  private async stageSummarize(): Promise<Task<TComponent, TContext, TActionResult, TNote>> {
    this.log('location processed')
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
      if (state && Object.keys(state as object).length === 0)
        state = null as TContext
    }
    return {
      target: {
        pathname,
        pathParams: this.resolved.pathParams,
        search,
        hash,
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
      this.log('  inject routing props to component')
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
      this.log(`${stage} -> unknown result`)
    }
  }

//endregion

//region CanDeactivate

  private async blockNavigation(): Promise<void> {
    const canDeactivate = this.route.canDeactivate
    if (this.isCompleted() || !canDeactivate)
      return;
    this.log(`block navigation out from [ ${this.id} ]`)

    const routeActionData = this.getRouteActionData()

    /**
     *  https://github.com/ReactTraining/history/blob/master/docs/blocking-transitions.md
     */
    const blockHandler: Blocker = async (tx: Transition<TContext>) => {
      try {
        this.log(`invoke 'canDeactivate' action`)
        const pass = await canDeactivate(tx.location, routeActionData)
        this.log(`${pass ? 'can' : 'cannot'} be deactivated to [ ${Task.id(tx.location)} ]`)
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
    this.log('unblock navigation')
  }

//endregion

//region Utils

  private get options(): IBrowserRouterOptions {
    return this.router.options
  }

  private get pathResolver(): PathResolver {
    return this.router.pathResolver
  }

  private log(...args) {
    this.router.log(this.id, ...args)
  }

//endregion

}
