import {IActionData, IPath, PathResolver, RouteContext, Routes, RoutingResult} from '@do-while-for-each/path-resolver'
import {Action, Blocker, BrowserHistory, createBrowserHistory, State, Update} from 'history'
import {distinctUntilChanged, filter, shareReplay} from 'rxjs/operators'
import {Subject} from 'rxjs'
import {LocationHandler} from './location-handler'
import {defaultOptions, To} from './contract'
import {Path} from './path'
import {Task} from './task'

export class BrowserRouter<TComponent = any,
  TContext extends RouteContext = RouteContext,
  TActionResult extends RoutingResult<TComponent> = RoutingResult<TComponent>,
  TNote = any> {

  public readonly pathResolver: PathResolver
  private readonly history: BrowserHistory<State> = createBrowserHistory() // https://github.com/ReactTraining/history/blob/master/docs/getting-started.md#basic-usage
  private readonly locationHandler: LocationHandler // the every location change is processed in a separate task

  private readonly window: WindowProxy & typeof globalThis

  public readonly componentSubj = new Subject<{ // if routing result is component
    component: TComponent;
    routeActionData: IActionData<TContext>
  }>()

  constructor(routes: Routes,
              public readonly options = defaultOptions) {
    this.pathResolver = new PathResolver(routes, options.pathResolver)
    this.locationHandler = new LocationHandler(this)
    if (!document?.defaultView)
      throw new Error(`Object 'window' must be present, because this is Browser Router`)
    this.window = document.defaultView
  }

  get currentPath(): IPath {
    return Path.normalize(this.window.location)
  }

  start(ctx?: TContext) {
    this.gotoWithoutChangingLocation(ctx)
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
      ? this.log(id, 'canceled')
      : result()
  }

  componentData$ = this.componentSubj.asObservable().pipe(
    filter(elem => !!elem?.component),
    distinctUntilChanged(),
    shareReplay(1),
  )


  goto(to: To, ctx?: TContext) {
    const path = Path.normalize(to);
    this.isSameLocation(path)
      ? this.gotoWithoutChangingLocation(ctx)
      : this.history.push(path, ctx)
  }

  redirect(to: To, ctx?: TContext) {
    this.history.replace(Path.normalize(to), ctx)
  }

  goBack() {
    this.history.back()
  }

  goForward() {
    this.history.forward()
  }

  goAway(href: string, target?: string) {
    if (target === '_blank') {
      this.window.open(href, target)
    } else {
      this.window.location.assign(href)
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
  gotoWithoutChangingLocation(ctx: TContext = null as TContext) {
    const update: Update<TContext> = {
      action: Action.Push,
      location: {
        state: ctx,
        key: this.window.history.state?.key || 'default',
        ...this.currentPath as Required<IPath>
      }
    }
    this.onLocationChange(update)
  }

  block(blocker: Blocker<TContext>): any {
    return this.history.block(blocker)
  }


//region Utils

  log(id: string, text: string) {
    if (this.options.isDebug)
      console.log(`[ ${id} ]`, text)
  }

  isSameLocation(path: IPath): boolean {
    return Path.isEqualsLocation(this.currentPath, path)
  }

//endregion

}
