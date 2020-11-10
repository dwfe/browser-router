import {ActionResult, GoTo, IActionData, PathResolver, PathResolveResult, Route, Routes, ToType} from '@do-while-for-each/path-resolver'
import {BrowserHistory, createBrowserHistory, State, Update} from 'history'
import {Observable, Subject} from 'rxjs'
import {filter, shareReplay} from 'rxjs/operators'

export class BrowserRouter<TComponent = any, TContext extends State = State> {
  private pathResolver: PathResolver
  private history: BrowserHistory<State> = createBrowserHistory()
  private component = new Subject<TComponent>()

  constructor(routes: Routes) {
    this.pathResolver = new PathResolver(routes)
  }

  private async onLocationChange(update: Update<TContext>) {
    const {location} = update
    const url = `url: '${getUrl(location)}'`
    const resolved = this.pathResolver.resolve(location.pathname)
    if (resolved) {
      const {route, pathParams} = resolved as PathResolveResult
      const {redirectTo, component, action} = route as Route<TComponent, TContext>

      if (this.processResolve(redirectTo, component))
        return;
      else if (action) {
        let actionResult: ActionResult<TComponent>
        try {
          const data: IActionData<TContext> = {...update, pathParams}
          actionResult = await action(data)
        } catch (e) {
          throw new Error(`Processing of route resolve #2. Error run action(...) for ${url}. ${e}`)
        }
        const {redirectTo, component} = actionResult
        if (!this.processResolve(redirectTo, component)) {
          throw new Error(`Processing of route resolve #3. Impossible to process result from action(...) for ${url}`)
        }
      } else
        throw new Error(`Processing of route resolve #1. Impossible to process result for ${url}`)
    } else {
      throw new Error(`Cannot match any routes for ${url}`)
    }
  }

  private processResolve(redirectTo?: string, component?: TComponent): boolean {
    let success = false
    if (redirectTo) {
      success = true
      this.redirect(redirectTo)
    } else if (component) {
      success = true
      this.component.next(component)
    }
    return success
  }

  component$: Observable<TComponent> = this.component.asObservable().pipe(
    filter(elem => !!elem),
    shareReplay(1),
  )

  start(initTo: ToType = '') {
    this.history.listen(this.onLocationChange.bind(this))
    this.go(initTo)
  }

  go(to: ToType, ctx: TContext = {} as any) {
    to = convertStr(to)
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
    to = convertStr(to)
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
    to = convertStr(to)
    this.history.replace(to)
  }

}

const isGoAway = ({origin, target}: GoTo) =>
  target === '_blank'
  || origin && origin !== window.location.origin // eslint-disable-line
;
const getUrl = ({href, origin, pathname, search, hash}: GoTo): string =>
  href || `${origin || ''}${pathname || ''}${search || ''}${hash || ''}`
;
const getLocalRoute = (to: GoTo): GoTo => ({
  pathname: to.pathname,
  search: to.search,
  hash: to.hash
})
const convertStr = (to: GoTo | string): GoTo =>
  typeof to === 'string'
    ? {pathname: to}
    : to
;
