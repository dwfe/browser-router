import {RouteContext, RoutingResult} from '@do-while-for-each/path-resolver'
import {Location} from 'history'
import {Task} from './task'
import {BrowserRouter} from './browser-router'

export class LocationHandler<TComponent = any,
  TContext extends RouteContext = RouteContext,
  TActionResult extends RoutingResult<TComponent, TContext> = RoutingResult<TComponent, TContext>,
  TNote = any> {

  private tasks: { [id: string]: true } = {}

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
      .then(data => this.createTask(data))
      .then(task => task.runLifecycle())
      .finally(() => this.removeTask(taskId))
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
