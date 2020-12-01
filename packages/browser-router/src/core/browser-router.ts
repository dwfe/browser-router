import {GoTo, IActionData, PathResolver, RouteContext, Routes, RoutingResult, ToType} from '@do-while-for-each/path-resolver'
import {Action, Blocker, BrowserHistory, createBrowserHistory, Path, State, Update} from 'history'
import {Subject} from 'rxjs'
import {distinctUntilChanged, filter, shareReplay} from 'rxjs/operators'
import {convertGoToFromStr, createPath, getUrl, isEqualPaths, isGoAway} from '../globals'
import {LocationHandler} from './location-handler'
import {defaultOptions} from './contract'
import {Task} from './task'

export class BrowserRouter<TComponent = any,
  TContext extends RouteContext = RouteContext,
  TActionResult extends RoutingResult<TComponent, TContext> = RoutingResult<TComponent, TContext>,
  TNote = any> {

  public readonly pathResolver: PathResolver
  private readonly history: BrowserHistory<State> = createBrowserHistory() // https://github.com/ReactTraining/history/blob/master/docs/getting-started.md#basic-usage
  private readonly locationHandler: LocationHandler // the every location change is processed in a separate task

  private readonly window: WindowProxy & typeof globalThis

  public readonly componentSubj = new Subject<{ // if routing result is component
    component: TComponent;
    routeActionData: IActionData<TContext>
  }>()

  constructor(routes: Routes, public readonly options = defaultOptions) {
    this.pathResolver = new PathResolver(routes, options.pathResolver)
    this.locationHandler = new LocationHandler(this)
    if (!document?.defaultView)
      throw new Error(`Object 'window' must be present, because this is Browser Router`)
    this.window = document.defaultView
  }

  get currentPath(): Path {
    return createPath(this.window.location)
  }

  start(ctx?: TContext) {
    this.goWithoutChangingLocation(ctx)
    this.history.listen(this.onLocationChange.bind(this))
  }

  private onLocationChange({location}: Update<TContext>) {
    this.locationHandler
      .processLocation(location)
      .then(task => this.routeActivation(task))
  }

  private routeActivation(task?: Task) {
    if (!task)
      return;
    const {isCanceled, result, id} = task
    isCanceled
      ? this.trace(id, 'canceled')
      : result()
  }

  componentData$ = this.componentSubj.asObservable().pipe(
    filter(elem => !!elem?.component),
    distinctUntilChanged(),
    shareReplay(1),
  )


  go(to: ToType, ctx?: TContext) {
    to = convertGoToFromStr(to)
    if (isGoAway(to)) {
      this.goAway(to)
    } else {
      if (this.isSameLocation(to)) {
        this.goWithoutChangingLocation(ctx)
      } else {
        this.history.push(createPath(to), ctx)
      }
    }
  }

  /**
   *  At the moment when:
   *    - the page is loaded for the first time;
   *    - the page is refreshed;
   *    - user changed the location to the same one.
   *  we don't need to go anywhere => so we don't need to run this.go(...),
   *  because we are already in the target location.
   *  We just need to find the route and activate it.
   */
  goWithoutChangingLocation(ctx: TContext = null as TContext) {
    const update: Update<TContext> = {
      action: Action.Push,
      location: {
        state: ctx,
        key: this.window.history.state?.key || 'default',
        ...this.currentPath
      }
    }
    this.onLocationChange(update)
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
      this.window.open(url, '_blank')
    } else {
      this.window.location.assign(url)
    }
  }

  redirect(to: ToType, ctx?: TContext) {
    to = convertGoToFromStr(to)
    this.history.replace(to, ctx)
  }

  block(blocker: Blocker<TContext>): any {
    return this.history.block(blocker)
  }


//region Utils

  trace(id: string, text: string) {
    if (this.options.enableTrace)
      console.log(`[ ${id} ]`, text)
  }

  isSameLocation(to: GoTo): boolean {
    return isEqualPaths(to, this.currentPath)
  }

//endregion

}
