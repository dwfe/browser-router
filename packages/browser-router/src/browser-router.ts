import {GoTo, PathResolver, PathResolveResult, Route, Routes, ToType} from '@do-while-for-each/path-resolver'
import {BrowserHistory, createBrowserHistory, Update} from 'history'
import {Observable, Subject} from 'rxjs'
import {filter, shareReplay} from 'rxjs/operators'

export class BrowserRouter {
  private pathResolver: PathResolver
  private history: BrowserHistory = createBrowserHistory()
  private component = new Subject<any>()

  constructor(routes: Routes) {
    this.pathResolver = new PathResolver(routes)
  }

  private onLocationChange({location, action}: Update) {
    const result = this.pathResolver.resolve(location.pathname)
    if (result) {
      const {route} = result as PathResolveResult
      const {redirectTo, component} = route as Route
      if (redirectTo) {
        this.redirect(redirectTo)
      } else if (component) {
        this.component.next(component)
      } else {
        // action()
      }
    } else {
      throw new Error(`Cannot match any routes. ${getLocalRoute(location)}`)
    }
  }

  component$: Observable<any> = this.component.asObservable().pipe(
    filter(elem => !!elem),
    shareReplay(1),
  )

  start(initTo: ToType = '') {
    this.history.listen(this.onLocationChange.bind(this))
    this.go(initTo)
  }

  go(to: ToType) {
    to = convertStr(to)
    if (isGoAway(to)) {
      this.goAway(to)
    } else {
      this.history.push(getLocalRoute(to))
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
const getUrl = ({href, origin, pathname, search, hash}: GoTo) =>
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
