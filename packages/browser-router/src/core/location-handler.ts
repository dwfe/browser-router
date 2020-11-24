import {Route, RouteContext, RoutingResult} from '@do-while-for-each/path-resolver'
import {Blocker, Location, Transition} from 'history'
import {Task} from './task'
import {BrowserRouter} from './browser-router'

export class LocationHandler<TComponent = any,
  TContext extends RouteContext = RouteContext,
  TActionResult extends RoutingResult<TComponent, TContext> = RoutingResult<TComponent, TContext>,
  TNote = any> {

  private tasks: { [id: string]: true } = {}

  private unblock: any // unblock function for canDeactivate

  constructor(private router: BrowserRouter<TComponent, TContext, TActionResult, TNote>) {
  }

  public async processLocation(location: Location<TContext>): Promise<Task<TComponent, TContext, TActionResult, TNote> | undefined> {
    const taskId = Task.id(location)
    this.trace(taskId, 'start processing location')

    if (this.isTaskExist(taskId)) {
      this.trace(taskId, 'duplicate, skipped')
      return;
    }
    return this.resolveRoute({location, taskId})
      .then(data => {
        const task = this.createTask(data)
        this.blockNavigation(task, data)
        return task
      })
      .then(task => task.runLifecycle())
      .catch(err => {
        this.unblockNavigation()
        throw err
      })
      .finally(() => {
        this.removeTask(taskId)
      })
  }

  private async resolveRoute({location, taskId}) {
    this.trace(taskId, 'resolving route...')
    const resolved = this.router.pathResolver.resolve(location.pathname)
    if (!resolved)
      throw new Error(`Cannot match any routes for [ ${taskId} ]`)
    return {taskId, location, resolved}
  }

  private async createTask({taskId, location, resolved}): Promise<Task<TComponent, TContext, TActionResult, TNote>> {
    const task = new Task(taskId, location, resolved, this.router)
    if (!this.addTask(taskId))
      task.isCanceled = true
    return task
  }

  private blockNavigation(task, {resolved}) {
    const canDeactivate = (resolved.route as Route<TComponent, TContext, TActionResult, TNote>).canDeactivate
    if (canDeactivate && !task.isCompleted()) {
      const routeActionData = task.getRouteActionData()
      const blockHandler: Blocker = async (tx: Transition<TContext>) => {
        if (await canDeactivate(tx.location, routeActionData)) {
          this.unblockNavigation()
          tx.retry()
        }
      }
      this.unblock = this.router.block(blockHandler)
    }
  }

  private unblockNavigation() {
    if (this.unblock) {
      this.unblock()
      this.unblock = null
    }
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

  private removeTask(id: string): void {
    delete this.tasks[`${id}`]
  }


  private trace(taskId: string, stage: string) {
    this.router.trace(taskId, stage)
  }

}
