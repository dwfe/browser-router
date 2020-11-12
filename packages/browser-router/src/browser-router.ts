import {convertGoToFromStr, getLocalRoute, getUrl, IActionData, isGoAway, PathResolver, PathResolveResult, Route, RouteContext, Routes, RoutingResult, ToType} from '@do-while-for-each/path-resolver'
import {BrowserHistory, createBrowserHistory, Location, State, Update} from 'history'
import {Observable, Subject} from 'rxjs'
import {filter, shareReplay} from 'rxjs/operators'
import {addFirstSymbol, excludeFirstSymbol} from './globals';
import React = require('react');

export class BrowserRouter<TComponent = any,
  TContext extends RouteContext = RouteContext,
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
      const currentActionData = getCurrentActionData(location, resolved)

      if (this.processResult(route, currentActionData)
        || await this.processRouteAction(route as Route<TComponent, TContext, TActionResult, TNote>, currentActionData, url))
        return;

      throw new Error(`Impossible to process of route resolve for ${url}`)
    } else {
      throw new Error(`Cannot match any routes for ${url}`)
    }
  }

  private processResult({redirectTo, customTo, component}: RoutingResult<TComponent>, currentActionData: IActionData<TContext>): boolean {
    const context_for_To_or_Go = {previousActionData: currentActionData} as RouteContext as TContext
    if (redirectTo) {
      this.redirect(redirectTo, context_for_To_or_Go)
      return true
    } else if (customTo) {
      let {pathname, search, hash, isRedirect} = customTo
      search = addFirstSymbol('?', search)
      hash = addFirstSymbol('#', hash)
      const to = {pathname, search, hash}
      isRedirect = isRedirect === undefined || isRedirect === true

      if (isRedirect) {
        this.redirect(to, context_for_To_or_Go)
        return true
      } else {
        this.go(to, context_for_To_or_Go)
        return true
      }
    } else if (component) {
      component = injectProps(component, {currentActionData})
      this.component.next(component)
      return true
    }
    return false
  }

  private async processRouteAction({action}: Route<TComponent, TContext, TActionResult, TNote>, currentActionData: IActionData<TContext>, url): Promise<boolean> {
    if (!action)
      return false;

    let actionResult: TActionResult
    try {
      actionResult = await action(currentActionData)
    } catch (e) {
      throw new Error(`Error in route action(...) for ${url}. ${e}`)
    }
    if (!this.processResult(actionResult, currentActionData)) {
      // If the route action does not return one of {redirectTo / customTo / component},
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

const getCurrentActionData = <TContext extends RouteContext = RouteContext>({pathname, search, hash, state, key}: Location<TContext>, {route, pathParams}: PathResolveResult): IActionData<TContext> => {
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
