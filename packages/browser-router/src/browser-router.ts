import {convertGoToFromStr, getLocalRoute, getUrl, IActionData, isGoAway, PathResolver, PathResolveResult, Route, Routes, RoutingResult, ToType} from '@do-while-for-each/path-resolver'
import {BrowserHistory, createBrowserHistory, Location, State, Update} from 'history'
import {Observable, Subject} from 'rxjs'
import {filter, shareReplay} from 'rxjs/operators'

export class BrowserRouter<TComponent = any,
  TContext extends State = State,
  TActionResult extends RoutingResult<TComponent, TContext> = RoutingResult<TComponent, TContext>,
  TNote = any> {
  private pathResolver: PathResolver
  private history: BrowserHistory<State> = createBrowserHistory()
  private component = new Subject<TComponent>()

  constructor(routes: Routes) {
    this.pathResolver = new PathResolver(routes)
  }

  private async onLocationChange({location}: Update<TContext>) {
    const url = `'${getUrl(location)}'`
    const resolved = this.pathResolver.resolve(location.pathname)
    if (resolved) {
      const {route} = resolved
      const data = getActionData(location, resolved)
      if (this.processResult(route)
        || await this.processRouteAction(route as Route<TComponent, TContext, TActionResult, TNote>, data, url))
        return;
      throw new Error(`Impossible to process of route resolve for ${url}`)
    } else {
      throw new Error(`Cannot match any routes for ${url}`)
    }
  }

  private processResult({redirectTo, customTo, component}: RoutingResult<TComponent>): boolean {
    if (redirectTo) {
      this.redirect(redirectTo)
      return true
    } else if (customTo) {
      const {pathname, isRedirect, actionData} = customTo
      if (isRedirect) {
        this.redirect(pathname)
        return true
      } else {
        this.go(pathname)
        return true
      }
    } else if (component) {
      this.component.next(component)
      return true
    }
    return false
  }

  private async processRouteAction({action}: Route<TComponent, TContext, TActionResult, TNote>, data: IActionData<TContext>, url): Promise<boolean> {
    if (!action)
      return false;

    let actionResult: TActionResult
    try {
      actionResult = await action(data)
    } catch (e) {
      throw new Error(`Error in route action(...) for ${url}. ${e}`)
    }
    if (!this.processResult(actionResult)) {
      // If the route action does not return one of {redirectTo OR component},
      // so here you need to send the actionResult to the waiting listeners,
      // but why anyone would want to do that - I can't think of a single case...
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

  redirect(to: ToType, ctx?: TContext) {
    to = convertGoToFromStr(to)
    this.history.replace(to, ctx)
  }

}

const getActionData = <TContext extends State = State>({pathname, search, hash, state}: Location<TContext>, {route, pathParams}: PathResolveResult): IActionData<TContext> => ({
  targetGoTo: {
    pathname,
    pathParams,
    search,
    searchParams: new URLSearchParams(search),
    hash: hash && hash.replace('#', ''),
  },
  data: {
    ctx: state,
    note: route.note,
  },
})
