import {Action, Blocker, BrowserHistory, createBrowserHistory, Update} from 'history'
import {IPath, normalizePath} from '@do-while-for-each/common'
import {PathResolver} from '@do-while-for-each/path-resolver'
import {defaultOpt, IEntry, ILocation, To} from './contract'
import {LocationHandler} from './location-handler'
import {ResultListeners} from '../result.listeners'
import {Path} from '../util/path'

export class BrowserRouter {

  public pathResolver: PathResolver
  public resultListeners = new ResultListeners()

  private locationHandler: LocationHandler // the every location change is processed in a separate task
  private history: BrowserHistory = createBrowserHistory() // https://github.com/ReactTraining/history/blob/master/docs/getting-started.md#basic-usage
  private window: WindowProxy & typeof globalThis;

  constructor(entries: IEntry[],
              public opt = defaultOpt) {
    if (!document.defaultView)
      throw new Error(`Object 'window' must be present, because this is router for Browser`)
    this.window = document.defaultView;
    this.pathResolver = new PathResolver(entries, opt.pathResolver)
    this.locationHandler = new LocationHandler(this)
  }

  start(ctx?: any): void {
    this.gotoWithoutChangeLocation(this.getCurrentPath(), ctx)
    this.history.listen(this.onLocationChange.bind(this))
  }

  private onLocationChange({location}: Update): void {
    this.locationHandler.run(location as ILocation);
  }

  block(blocker: Blocker): () => void {
    return this.history.block(blocker)
  }


//region Navigation

  goto(to: To, ctx?: any): void {
    const path = Path.normalize(to);
    const currentPath = this.getCurrentPath();
    (currentPath.pathname !== path.pathname || currentPath.search !== path.search)
      ? this.history.push(path, ctx)
      : this.gotoWithoutChangeLocation(currentPath, ctx, path.hash)
  }

  redirect(to: To, ctx?: any): void {
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
  gotoWithoutChangeLocation(currentPath: Required<IPath>, ctx?: any, hash?: string): void {
    const update: Update = {
      action: Action.Push,
      location: {
        state: ctx || null,
        key: this.window.history.state?.key || 'default',
        ...currentPath,
        hash: hash ?? currentPath.hash, // location has not changed, but hash can
      }
    }
    this.onLocationChange(update)
  }

//endregion Navigation


//region Support

  getCurrentPath(): Required<IPath> {
    return normalizePath(this.window.location)
  }

  log(id: string, ...args: string[]): void {
    if (this.opt.isDebug)
      console.log(`[ ${id} ]`, ...args)
  }

//endregion

}
