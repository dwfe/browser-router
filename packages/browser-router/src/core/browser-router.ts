import {IActionResult, IPath, IRoute, PathResolver, TRouteContext} from '@do-while-for-each/path-resolver'
import {Action, Blocker, BrowserHistory, createBrowserHistory, State, Update} from 'history'
import {defaultOptions, IResultListenersArg, To} from './contract'
import {LocationHandler} from './location-handler'
import {ResultListeners} from './result.listeners'
import {Path} from './path'
import {Task} from './task'

export class BrowserRouter<TComponent = any, TNote = any,
  TActionResult extends IActionResult<TComponent> = IActionResult<TComponent>,
  TContext extends TRouteContext = TRouteContext> {

  public pathResolver: PathResolver
  private history: BrowserHistory<State> = createBrowserHistory() // https://github.com/ReactTraining/history/blob/master/docs/getting-started.md#basic-usage
  private locationHandler: LocationHandler // the every location change is processed in a separate task

  private window: WindowProxy & typeof globalThis

  public resultListeners = new ResultListeners<IResultListenersArg<TComponent, TNote, TContext>>()

  constructor(routes: IRoute[],
              public options = defaultOptions) {
    if (!document?.defaultView)
      throw new Error(`Object 'window' must be present, because this is router of Browser`)
    this.window = document.defaultView
    this.pathResolver = new PathResolver(routes, options.pathResolver)
    this.locationHandler = new LocationHandler(this)
  }

  get currentPath(): Path {
    return Path.of(this.window.location)
  }

  start(ctx?: TContext): void {
    this.gotoWithoutChangeLocation(ctx)
    this.history.listen(this.onLocationChange.bind(this))
  }

  private onLocationChange({location}: Update<TContext>): void {
    this.locationHandler
      .processLocation(location)
      .then(task => this.routeActivation(task))
  }

  private routeActivation(task?: Task): void {
    if (!task)
      return;
    const {isCanceled, result, id} = task
    isCanceled
      ? this.log(id, 'canceled')
      : result()
  }

  goto(to: To, ctx?: TContext): void {
    const path = Path.normalize(to);
    this.isSameLocation(path)
      ? this.gotoWithoutChangeLocation(ctx, path.hash)
      : this.history.push(path, ctx)
  }

  redirect(to: To, ctx?: TContext): void {
    this.history.replace(Path.normalize(to), ctx)
  }

  goBack(): void {
    this.history.back()
  }

  goForward(): void {
    this.history.forward()
  }

  goAway(href: string, target?: string): void {
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
   *  we don't need to go anywhere => so we don't need to run this.goto(...),
   *  because we are already in the target location.
   *  We just need to find the route and activate it.
   */
  gotoWithoutChangeLocation(ctx: TContext = null as TContext, hash?: string): void {
    const currentPath = this.currentPath.simplify()
    const update: Update<TContext> = {
      action: Action.Push,
      location: {
        state: ctx,
        key: this.window.history.state?.key || 'default',
        ...currentPath,
        hash: hash || currentPath.hash // location has not changed, but hash can
      }
    }
    this.onLocationChange(update)
  }

  block(blocker: Blocker<TContext>): () => void {
    return this.history.block(blocker)
  }


//region Utils

  log(id: string, ...args): void {
    if (this.options.isDebug)
      console.log(`[ ${id} ]`, ...args)
  }

  isSameLocation(path: IPath): boolean {
    return this.currentPath.isLocationEquals(path)
  }

//endregion

}
