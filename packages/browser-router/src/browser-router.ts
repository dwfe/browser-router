import {convertGoToFromStr, getLocalRoute, getUrl, IActionData, isGoAway, PathParams, PathResolver, PathResolveResult, Route, Routes, RoutingResult, ToType} from '@do-while-for-each/path-resolver'
import {BrowserHistory, createBrowserHistory, State, Update} from 'history'
import {Observable, Subject} from 'rxjs'
import {filter, shareReplay} from 'rxjs/operators'

export class BrowserRouter<TComponent = any, TContext extends State = State, TActionResult extends RoutingResult<TComponent> = RoutingResult<TComponent>> {
  private pathResolver: PathResolver
  private history: BrowserHistory<State> = createBrowserHistory()
  private component = new Subject<TComponent>()

  constructor(routes: Routes) {
    this.pathResolver = new PathResolver(routes)
  }

  private async onLocationChange(update: Update<TContext>) {
    const {location} = update
    if (location.state === null) // after change hash into browser command line, history auto update location with state === null
      return;
    const url = `'${getUrl(location)}'`
    const resolved = this.pathResolver.resolve(location.pathname)
    if (resolved) {
      const {route, pathParams} = resolved as PathResolveResult
      const data = this.getActionData(update, pathParams)
      if (this.processPathResolve(route)
        || await this.processRouteAction(route as Route<TComponent, TContext, TActionResult>, data, url))
        return;
      throw new Error(`Impossible to process of route resolve for ${url}`)
    } else {
      throw new Error(`Cannot match any routes for ${url}`)
    }
  }

  private getActionData({location, action}: Update<TContext>, pathParams: PathParams): IActionData<TContext> {
    const {pathname, search, hash, key, state} = location
    return {
      to: {
        pathname,
        pathParams,
        search,
        searchParams: new URLSearchParams(search),
        hash: hash && hash.replace('#', ''),
      },
      ctx: state,
      key,
      action
    }
  }


  private processPathResolve({redirectTo, component}: RoutingResult<TComponent>): boolean {
    if (redirectTo) {
      this.redirect(redirectTo)
      return true
    } else if (component) {
      this.component.next(component)
      return true
    }
    return false
  }

  private async processRouteAction({action}: Route<TComponent, TContext, TActionResult>, data: IActionData<TContext>, url): Promise<boolean> {
    if (!action)
      return false;

    let actionResult: TActionResult
    try {
      actionResult = await action(data)
    } catch (e) {
      throw new Error(`Error in route action(...) for ${url}. ${e}`)
    }
    if (!this.processPathResolve(actionResult)) {
      // If the route action does not return one of {redirectTo OR component},
      // so here you need to send the actionResult to the waiting listeners,
      // but why anyone would want to do that - I can't think of...
    }
    return true
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

  redirect(to: ToType) {
    to = convertGoToFromStr(to)
    this.history.replace(to)
  }

}
