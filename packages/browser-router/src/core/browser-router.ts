import {PathResolver, RouteContext, Routes, RoutingResult, ToType} from '@do-while-for-each/path-resolver'
import {BrowserHistory, createBrowserHistory, Location, State, Update} from 'history'
import {Observable, Subject} from 'rxjs'
import {distinctUntilChanged, filter, shareReplay} from 'rxjs/operators'
import {convertGoToFromStr, getLocalRoute, getUrl, isGoAway} from '../globals'
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
  private tasks: { [id: string]: true } = {}

  constructor(routes: Routes, public readonly options = defaultBrowserRouterOptions) {
    this.pathResolver = new PathResolver(routes)
  }

  start(initTo: ToType = '') {
    this.history.listen(this.onLocationChange.bind(this))
    this.go(initTo)
  }

  private async onLocationChange({location}: Update<TContext>) {
    this.lastLocationKey = location.key

    const taskId = Task.id(location)
    if (this.isTaskExist(taskId)) {
      this.trace(taskId, 'duplicate, skipped')
      return;
    }
    const task = await this.createAndRunTask(location, taskId)
    this.routeActivation(task)
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


  private trace(taskId: string, stage = '') {
    if (this.options.enableTrace)
      console.log(`[ ${taskId} ]`, stage)
  }

//region Task

  private async createAndRunTask(location: Location<TContext>, taskId: string): Promise<Task<TComponent, TContext, TActionResult, TNote>> {
    const task = await this.stageResolveRoute(location, taskId)
    try {
      return await task.runLifecycle()
    } catch (e) {
      this.removeTask(taskId)
      throw e
    }
  }

  private async stageResolveRoute(location: Location<TContext>, taskId: string): Promise<Task<TComponent, TContext, TActionResult, TNote>> {
    this.trace(taskId, 'resolving route...')
    const resolved = this.pathResolver.resolve(location.pathname)
    if (!resolved)
      throw new Error(`Cannot match any routes for [ ${taskId} ]`)
    const task = new Task(taskId, location, resolved, this)
    if (!this.addTask(taskId))
      task.isCanceled = true
    return task
  }

  private routeActivation({id, isCanceled, result}: Task<TComponent, TContext, TActionResult, TNote>) {
    isCanceled
      ? this.trace(id, 'canceled')
      : result()
    this.removeTask(id)
  }


  private isTaskExist(id: string) {
    return !!this.getTask(id)
  }

  private getTask(id: string): true | undefined {
    return this.tasks[`${id}`]
  }

  private addTask(id: string): true | undefined {
    if (!this.isTaskExist(id)) {
      this.tasks[`${id}`] = true
      return true
    }
  }

  private removeTask(id: string) {
    delete this.tasks[`${id}`]
  }

//endregion

}
