import {IActionResult, RouteContext} from '@do-while-for-each/path-resolver'
import {Location} from 'history'
import {BrowserRouter} from './browser-router'
import {Task} from './task'

export class LocationHandler<TComponent = any,
  TContext extends RouteContext = RouteContext,
  TActionResult extends IActionResult<TComponent> = IActionResult<TComponent>,
  TNote = any> {

  private tasks = new Map<string, Task>()

  constructor(private router: BrowserRouter<TComponent, TContext, TActionResult, TNote>) {
  }

  public async processLocation(location: Location<TContext>): Promise<Task<TComponent, TContext, TActionResult, TNote> | undefined> {
    const id = Task.id(location)
    this.log(id, 'start processing location')

    if (this.tasks.has(id)) {
      this.log(id, 'duplicate, skipped')
      return;
    }
    return this.resolveRoute({id, location})
      .then(data => this.createTask(data))
      .then(task => task.runLifecycle())
      .finally(() => this.tasks.delete(id))
  }

  private async resolveRoute({id, location}) {
    this.log(id, 'resolving route...')
    const resolved = this.router.pathResolver.resolve(location.pathname)
    if (!resolved)
      throw new Error(`Cannot match any routes for [ ${id} ]`)
    return {id, location, resolved}
  }

  private createTask({id, location, resolved}): Task<TComponent, TContext, TActionResult, TNote> {
    const task = new Task(id, location, resolved, this.router)
    task.isCanceled = this.tasks.has(id)
    if (!task.isCanceled)
      this.tasks.set(id, task)
    return task
  }

  private log(id: string, ...args) {
    this.router.log(id, ...args)
  }

}
