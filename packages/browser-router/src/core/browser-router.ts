import {PathResolver, RouteContext, Routes, RoutingResult, ToType} from '@do-while-for-each/path-resolver'
import {BrowserHistory, createBrowserHistory, State, Update} from 'history'
import {Observable, Subject} from 'rxjs'
import {distinctUntilChanged, filter, shareReplay} from 'rxjs/operators'
import {convertGoToFromStr, getLocalRoute, getUrl, isGoAway} from '../globals'
import {defaultBrowserRouterOptions} from './contract';
import {Task} from './task'
import {LocationHandler} from './location-handler'

export class BrowserRouter<TComponent = any,
  TContext extends RouteContext = RouteContext,
  TActionResult extends RoutingResult<TComponent, TContext> = RoutingResult<TComponent, TContext>,
  TNote = any> {

  public readonly pathResolver: PathResolver
  private readonly history: BrowserHistory<State> = createBrowserHistory()
  private locationHandler: LocationHandler // the location change is processed in a separate task
  public readonly componentSubj = new Subject<TComponent>() // routing result is component
  public lastLocationKey: string = '' // unique string on every new location

  constructor(routes: Routes, public readonly options = defaultBrowserRouterOptions) {
    this.pathResolver = new PathResolver(routes)
    this.locationHandler = new LocationHandler(this)
  }

  start(initTo: ToType = '') {
    this.history.listen(this.onLocationChange.bind(this))
    this.go(initTo)
  }

  private async onLocationChange({location}: Update<TContext>) {
    this.lastLocationKey = location.key
    this.locationHandler
      .processLocation(location)
      .then(task => this.routeActivation(task))
  }

  private routeActivation(task?: Task) {
    if (!task)
      return;
    const {id, isCanceled, result} = task
    isCanceled
      ? this.trace(id, 'canceled')
      : result()
    this.locationHandler.removeTask(id)
  }

  component$: Observable<TComponent> = this.componentSubj.asObservable().pipe(
    filter(elem => !!elem),
    distinctUntilChanged(),
    shareReplay(1),
  )


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


  public trace(taskId: string, stage: string) {
    if (this.options.enableTrace)
      console.log(`[ ${taskId} ]`, stage)
  }

}
