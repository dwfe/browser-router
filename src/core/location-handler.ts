import {IPathResolveResult} from '@do-while-for-each/path-resolver';
import {normalizePath} from '@do-while-for-each/common'
import {BrowserRouter} from './browser-router'
import {ILocation} from './contract';
import {Task} from './task'

export class LocationHandler {

  private tasks = new Map<string, Task>()

  constructor(private router: BrowserRouter) {
  }

  run(location: ILocation): void {
    location = {...location, ...normalizePath(location)}
    const id = Task.id(location)
    this.log(id, 'start processing location')

    if (this.tasks.has(id)) {
      this.log(id, 'duplicate, skipped')
      return;
    }
    this.resolveRoute([id, location])
      .then(data => this.createTask(data))
      .then(task => task?.runLifecycle())
      .then(task => task && !task.isCanceled && task.result())
      .finally(() => this.tasks.delete(id))
  }

  private async resolveRoute([id, location]: [string, ILocation]): Promise<TResolveResult> {
    this.log(id, 'resolving route...')
    const pathResolveResult = this.router.pathResolver.resolve(location.pathname)
    if (!pathResolveResult)
      throw new Error(`Cannot find route for [ ${id} ]`)
    return [id, location, pathResolveResult];
  }

  private createTask([id, location, pathResolveResult]: TResolveResult): Task | undefined {
    if (this.tasks.has(id)) {
      this.log(id, 'duplicate, skipped');
      return;
    }
    const task = new Task(
      id,
      location,
      this.router,
      pathResolveResult,
    );
    this.tasks.set(id, task)
    return task
  }


//region Support

  private log(id: string, ...args: string[]) {
    if (this.router.opt.isDebug)
      this.router.log(id, ...args)
  }

//endregion Support

}

type TResolveResult = [string, ILocation, IPathResolveResult];
