import {convertGoToFromStr, getLocalRoute, getUrl, IActionData, isGoAway, PathResolver, PathResolveResult, Route, RouteContext, Routes, RoutingResult, ToType} from '@do-while-for-each/path-resolver'
import {BrowserHistory, createBrowserHistory, Location, State, Update} from 'history'
import {Observable, Subject} from 'rxjs'
import {filter, shareReplay} from 'rxjs/operators'
import {addFirstSymbol, excludeFirstSymbol} from '../globals';
import {defaultBrowserRouterOptions} from './contract';
import React = require('react');

interface Task<TComponent = any,
  TContext extends RouteContext = RouteContext,
  TActionResult extends RoutingResult<TComponent, TContext> = RoutingResult<TComponent, TContext>,
  TNote = any> {
  result?: any;
  isCanceled?: boolean;
  location: Location<TContext>;
  route: Route<TComponent, TContext, TActionResult, TNote>;
  parentRoute?: Route<TComponent, TContext, TActionResult, TNote>;
  routeActionData: IActionData<TContext>
}

export class BrowserRouter<TComponent = any,
  TContext extends RouteContext = RouteContext,
  TActionResult extends RoutingResult<TComponent, TContext> = RoutingResult<TComponent, TContext>,
  TNote = any> {

  private pathResolver: PathResolver
  private history: BrowserHistory<State> = createBrowserHistory()
  private component = new Subject<TComponent>()
  private lastLocationKey: string = '';
  private tasks: Map<string, Task<TComponent, TContext, TActionResult, TNote>> = new Map()

  constructor(routes: Routes, private options = defaultBrowserRouterOptions) {
    this.pathResolver = new PathResolver(routes)
  }

  private id(location: Location<TContext>): string {
    return getUrl(location)
  }

  private trace(location: Location<TContext>, stage = '') {
    if (this.options.enableTrace)
      console.log(this.id(location), stage)
  }

  private needToStopTaskCycle(task: Task): boolean {
    task.isCanceled = task.location.key !== this.lastLocationKey
    return task.isCanceled || task.result
  }

  private addTask(task: Task<TComponent, TContext, TActionResult, TNote>): boolean | undefined {
    const id = this.id(task.location)
    const existed = this.tasks.get(id)
    if (!existed) {
      this.tasks.set(id, task)
      return true
    }
  }

  private removeTask(location: Location<TContext>) {
    this.tasks.delete(this.id(location))
  }

  private isTaskExist(location: Location<TContext>) {
    return !!this.tasks.get(this.id(location))
  }

  private async onLocationChange({location}: Update<TContext>) {
    if (this.isTaskExist(location))
      return;

    this.trace(location)
    this.lastLocationKey = location.key

    try {
      const task = await this.runLifecycle(location)
      if (task.isCanceled) {
        this.trace(location, 'canceled')
      } else if (task.result) {
        task.result()
      }
      this.removeTask(location)
    } catch (e) {
      this.removeTask(location)
      throw e
    }
  }

  private async runLifecycle(location: Location<TContext>): Promise<Task<TComponent, TContext, TActionResult, TNote>> {
    return this.stageResolveRoute(location)
      .then(task => this.stageProcessResult(task.route, task))
      .then(task => this.stageInvokeRouteAction(task))
      .then(task => this.stageSummarize(task))
  }

  private async stageResolveRoute(location: Location<TContext>): Promise<Task<TComponent, TContext, TActionResult, TNote>> {
    this.trace(location, 'stageResolveRoute')
    const resolved = this.pathResolver.resolve(location.pathname)
    if (!resolved)
      throw new Error(`Cannot match any routes for '${this.id(location)}'`)
    const task = {
      location,
      route: resolved.route as Route<TComponent, TContext, TActionResult, TNote>,
      parentRoute: resolved.parentRoute as Route<TComponent, TContext, TActionResult, TNote>,
      routeActionData: this.getRouteActionData(resolved, location)
    } as Task<TComponent, TContext, TActionResult, TNote>
    if (!this.addTask(task))
      task.isCanceled = true
    return task
  }

  private getRouteActionData({route, pathParams}: PathResolveResult, {pathname, search, hash, state, key}: Location<TContext>): IActionData<TContext> {
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
        pathParams,
        search: excludeFirstSymbol('?', search),
        hash: excludeFirstSymbol('#', hash),
      },
      ctx: state,
      note: route.note,
      previous,
      key,
    }
  }

  private async stageProcessResult({redirectTo, customTo, component}: RoutingResult<TComponent>, task: Task<TComponent, TContext, TActionResult, TNote>): Promise<Task<TComponent, TContext, TActionResult, TNote>> {
    if (this.needToStopTaskCycle(task))
      return task;
    this.trace(task.location, 'stageProcessResult')

    const {routeActionData} = task
    const context_for_To_or_Go = {previousActionData: routeActionData} as RouteContext as TContext
    if (redirectTo) {
      task.result = () => this.redirect(redirectTo, context_for_To_or_Go)
      return task
    } else if (customTo) {
      let {pathname, search, hash, isRedirect} = customTo
      search = addFirstSymbol('?', search)
      hash = addFirstSymbol('#', hash)
      const to = {pathname, search, hash}
      isRedirect = isRedirect === undefined || isRedirect === true

      if (isRedirect) {
        task.result = () => this.redirect(to, context_for_To_or_Go)
        return task
      } else {
        task.result = () => this.go(to, context_for_To_or_Go)
        return task
      }
    } else if (component) {
      if (this.options.injectRouteActionsDataToComponent)
        component = injectProps(component, {routeActionData})
      task.result = () => this.component.next(component)
      return task
    }
    return task
  }

  private async stageInvokeRouteAction(task: Task<TComponent, TContext, TActionResult, TNote>): Promise<Task<TComponent, TContext, TActionResult, TNote>> {
    if (this.needToStopTaskCycle(task))
      return task;
    const {route, parentRoute, routeActionData, location} = task
    const {action} = route
    if (!action)
      return task;
    this.trace(task.location, 'stageInvokeRouteAction')

    let actionResult: TActionResult
    try {
      actionResult = await action(routeActionData) as TActionResult
    } catch (e) {
      throw new Error(`Error in route action(...) for ${this.id(location)}. ${e}`)
    }
    this.pathResolver.correctResultFromAction(location.pathname, actionResult, route, parentRoute)
    task = await this.stageProcessResult(actionResult, task)
    if (!this.needToStopTaskCycle(task)) {
      // If the route action does not return one of {redirectTo / customTo / component},
      // so here you need to send the actionResult to the waiting listeners,
      // but why anyone would want to do that - I can't think of a single case...
    }
    return task
  }

  private stageSummarize(task: Task<TComponent, TContext, TActionResult, TNote>): Task<TComponent, TContext, TActionResult, TNote> {
    if (!this.needToStopTaskCycle(task))
      throw new Error(`Impossible to process of resolved route for '${this.id(task.location)}'`)
    return task
  }

  component$: Observable<TComponent> = this.component.asObservable().pipe(
    filter(elem => !!elem),
    shareReplay(1),
  )

  start(initTo: ToType = '') {
    this.history.listen(this.onLocationChange.bind(this))
    this.go(initTo)
  }

  go(to: ToType, ctx?: TContext) {
    to = convertGoToFromStr(to)
    if (isGoAway(to)) {
      this.goAway(to)
    } else {
      this.history.push(getLocalRoute(to), ctx)
    }
  }

  goBack() {
    this.history.back()
  }

  goForward() {
    this.history.forward()
  }

  goAway(to: ToType) {
    to = convertGoToFromStr(to)
    const url = getUrl(to)
    if (!url)
      return;
    if (to.target === '_blank') {
      window.open(url, '_blank')
    } else {
      window.location.assign(url)
    }
  }

  redirect(to: ToType, ctx?: TContext) {
    to = convertGoToFromStr(to)
    this.history.replace(to, ctx)
  }

}


const injectProps = (component: any, props): any => {
  if (typeof component === 'object') {
    if (component.props) { // condition that component is React component
      return React.cloneElement(
        component as any,
        {...props}
      )
    }
    // else if() {}        // condition and inject for component in Your case
  }
  return component
}
