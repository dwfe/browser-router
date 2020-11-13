import {convertGoToFromStr, getLocalRoute, getUrl, isGoAway, PathResolver, RouteContext, Routes, RoutingResult, ToType} from '@do-while-for-each/path-resolver'
import {BrowserHistory, createBrowserHistory, Location, State, Update} from 'history'
import {Observable, Subject} from 'rxjs'
import {distinctUntilChanged, filter, shareReplay} from 'rxjs/operators'
import {defaultBrowserRouterOptions} from './contract';
import {Task} from './task'

export class BrowserRouter<TComponent = any,
  TContext extends RouteContext = RouteContext,
  TActionResult extends RoutingResult<TComponent, TContext> = RoutingResult<TComponent, TContext>,
  TNote = any> {

  public readonly pathResolver: PathResolver
  private readonly history: BrowserHistory<State> = createBrowserHistory()
  public readonly componentSubj = new Subject<TComponent>()

  public lastLocationKey: string = ''
  private tasks: Map<string, Task<TComponent, TContext, TActionResult, TNote>> = new Map()

  constructor(routes: Routes, public readonly options = defaultBrowserRouterOptions) {
    this.pathResolver = new PathResolver(routes)
  }

  start(initTo: ToType = '') {
    this.history.listen(this.onLocationChange.bind(this))
    this.go(initTo)
  }

  private async onLocationChange({location}: Update<TContext>) {
    const taskId = Task.id(location)
    if (this.isTaskExist(taskId))
      return;

    this.trace(taskId, 'start')
    this.lastLocationKey = location.key
    const task = await this.stageResolveRoute(location, taskId)

    try {
      await task.runLifecycle()
      task.isCanceled
        ? this.trace(taskId, 'canceled')
        : task.result()
      this.removeTask(taskId)
    } catch (e) {
      this.removeTask(taskId)
      throw e
    }
  }

  private async stageResolveRoute(location: Location<TContext>, taskId: string): Promise<Task<TComponent, TContext, TActionResult, TNote>> {
    this.trace(taskId, 'stageResolveRoute')
    const resolved = this.pathResolver.resolve(location.pathname)
    if (!resolved)
      throw new Error(`Cannot match any routes for '${taskId}'`)
    const task = new Task(taskId, location, resolved, this)
    if (!this.addTask(task))
      task.isCanceled = true
    return task
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


//region Handlers
  private isTaskExist(taskId: string) {
    return !!this.tasks.get(taskId)
  }

  private addTask(task: Task<TComponent, TContext, TActionResult, TNote>): boolean | undefined {
    if (!this.tasks.get(task.id)) {
      this.tasks.set(task.id, task)
      return true
    }
  }

  private removeTask(taskId: string) {
    this.tasks.delete(taskId)
  }

  private trace(taskId: string, stage = '') {
    if (this.options.enableTrace)
      console.log(`[ ${taskId} ]`, stage)
  }

//endregion

}
