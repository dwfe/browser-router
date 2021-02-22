import {IActionResult, TRouteContext} from '@do-while-for-each/path-resolver'
import {Location} from 'history'
import {BrowserRouter} from './browser-router'
import {Task} from './task'

export class LocationHandler<TComponent = any, TNote = any,
  TActionResult extends IActionResult<TComponent> = IActionResult<TComponent>,
  TContext extends TRouteContext = TRouteContext> {

  private tasks = new Map<string, Task>()

  constructor(private router: BrowserRouter<TComponent, TNote, TActionResult, TContext>) {
  }

  public async processLocation(location: Location<TContext>): Promise<Task<TComponent, TNote, TActionResult, TContext> | undefined> {
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

  private createTask({id, location, resolved}): Task<TComponent, TNote, TActionResult, TContext> {
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
