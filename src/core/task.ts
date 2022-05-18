import {IPath, isPathEqual, normalizePath, normalizePathname, pathToString} from '@do-while-for-each/common'
import {Blocker, Transition} from 'history'
import {Entry, IActionData, IEntryResult, ILocation, IPathResolveResult, IState} from './contract';
import {BrowserRouter} from './browser-router'
import {Path} from '../util/path'

export class Task {

  actionData: IActionData; // data passed to the action
  result!: () => void // task result is either a redirect to another location or a component for rendering
  isCanceled = false // task can be canceled if the user changed the location while the current one was being processed
  unblockNavigationFn: any // unblock function if 'canDeactivate' action is defined

  constructor(public id: string,
              private location: ILocation,
              private router: BrowserRouter,
              private pathResolveResult: IPathResolveResult) {
    this.actionData = Task.getActionData(location, pathResolveResult);
  }

  isCompleted(): boolean {
    if (!this.isCanceled) {
      this.isCanceled = !isPathEqual(this.location, this.router.getCurrentPath());
      if (this.isCanceled)
        this.log('cancelled due to location change');
    }
    return this.isCanceled || !!this.result
  }


//region Task Lifecycle

  runLifecycle = (): Promise<Task> =>
    this.stageCanActivate()
      .then(() => this.blockNavigation()) // if 'canDeactivate' action is defined
      .then(() => this.stageProcessResult(this.entry))
      .then(() => this.stageSummarize())
      .catch(err => {
        this.unblockNavigation()
        throw err
      })
  ;

  private async stageCanActivate(): Promise<void> {
    const {length} = this.canActivateEntries;
    if (this.isCompleted() || length === 0)
      return;
    this.log(`invoke 'canActivate' actions[${length}]`)
    for (let i = 0; i < length; i++) {
      const {canActivate, pathTemplate} = this.canActivateEntries[i];
      this.log(`-> ${i + 1}th canActivate for: '${pathTemplate}'`);
      try {
        if (!canActivate)
          throw new Error(`Undefined "canActivate" for [ ${pathTemplate} ]`);
        const result = await canActivate(this.actionData);
        if (result === true) {
          this.log('-> ok');

        } else {
          this.log(`-> cannot be activated`);
          await this.stageProcessResult(result);
          return; // this.isCompleted() --> true
        }
      } catch (err) {
        console.error(`Error processing 'canActivate' for [ ${this.id} ]:`, err);
        throw new Error(`Error processing 'canActivate' for [ ${this.id} ].`);
      }
    }
  }

  private async stageProcessResult(result: IEntryResult): Promise<void> {
    if (this.isCompleted())
      return;
    this.log('process result')

    const ctx: IState = {actionData: this.actionData};
    const {component, redirectTo, customTo, action} = result;
    if (component) {
      this.result = () => {
        this.log(`-> component`)
        this.router.resultListeners.call({
          component,
          actionData: this.actionData
        })
      }
      return;
    }
    if (redirectTo) {
      this.result = () => {
        this.log(`-> redirectTo '${normalizePathname(redirectTo)}'`)
        this.router.redirect(redirectTo, ctx)
      }
      return;
    }
    if (customTo) {
      const pathStr = pathToString(normalizePath(customTo));
      this.result = customTo.asGoto
        ? () => {
          this.log(`-> goto '${pathStr}'`)
          this.router.goto(customTo, ctx)
        }
        : () => {
          this.log(`-> redirectTo '${pathStr}'`)
          this.router.redirect(customTo, ctx)
        }
      return;
    }
    if (action) {
      try {
        this.log(`invoke 'action'`);
        const result = await action(this.actionData);
        await this.stageProcessResult(result);
        return;
      } catch (err) {
        console.error(`Error processing 'action' for [ ${this.id} ]:`, err);
        throw new Error(`Error processing 'action' for [ ${this.id} ].`);
      }
    }
    console.error('The result of the action must contain one of: component, redirectTo, customTo, action.', result);
    throw new Error('There is no result in the action');
  }

  private async stageSummarize(): Promise<Task> {
    this.log('location processed')
    if (!this.isCompleted())
      throw new Error(`Impossible to process of resolved path [ ${this.id} ]`)
    return this
  }

//endregion Task Lifecycle


//region CanDeactivate

  private async blockNavigation(): Promise<void> {
    if (this.isCompleted() || !this.entry.canDeactivate)
      return;
    this.log(`block navigation out from [ ${this.id} ]`)

    /**
     *  https://github.com/ReactTraining/history/blob/master/docs/blocking-transitions.md
     */
    const blockHandler: Blocker = async (tx: Transition) => {
      const {canDeactivate, pathTemplate} = this.entry;
      try {
        if (!canDeactivate)
          throw new Error(`Undefined "canDeactivate" for [ ${pathTemplate} ]`);
        this.log(`invoke 'canDeactivate' action`)
        const pass = await canDeactivate(tx.location as ILocation, this.actionData)
        this.log(`${pass ? 'can' : 'cannot'} be deactivated to [ ${Task.id(tx.location)} ]`)
        if (pass) {
          this.unblockNavigation()
          tx.retry()
        }
      } catch (err) {
        this.unblockNavigation()
        console.error(`Error processing 'canDeactivate' for [ ${this.id} ]:`, err);
        throw new Error(`Error processing 'canDeactivate' for [ ${this.id} ].`);
      }
    }
    this.unblockNavigationFn = this.router.block(blockHandler)
  }

  private unblockNavigation() {
    if (!this.unblockNavigationFn)
      return;
    this.unblockNavigationFn()
    this.unblockNavigationFn = null
    this.log(`unblock navigation out from [ ${this.id} ]`)
  }

//endregion CanDeactivate


//region Support

  static id = (path: IPath): string => Path.of(path).toString()

  private get entry(): Entry {
    return this.pathResolveResult.entry;
  }

  private get canActivateEntries(): Entry[] {
    return this.pathResolveResult.canActivateEntries;
  }

  private static getActionData(
    {pathname, search, hash, state, key}: ILocation,
    {entry: {note, name}, pathnameParams}: IPathResolveResult
  ): IActionData {
    let previous;
    if (state) {
      previous = state.actionData;
      if (previous) {
        if (Object.keys(state).length === 1)
          state = null
        else
          delete state.actionData
      }
    }
    return {
      target: {
        pathname,
        search,
        hash,
        pathnameParams,
      },
      route: {
        note,
        name,
      },
      ctx: state,
      key,
      previous,
    }
  }

  private log(...args: string[]) {
    if (this.router.opt.isDebug)
      this.router.log(this.id, ...args)
  }

//endregion Support

}
