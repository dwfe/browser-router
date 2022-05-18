import {Entry as EntryOrig, ICustomTo, IEntry as IEntryOrig, IPathResolveResult as IPathResolveResultOrig, IPathResolverOpt} from '@do-while-for-each/path-resolver'
import {IPath, IPathnameParams} from '@do-while-for-each/common'

export interface IBrowserRouterOptions {
  isDebug?: boolean;
  pathResolver?: IPathResolverOpt;
}

export const defaultOpt: IBrowserRouterOptions = {
  isDebug: false,
  pathResolver: {
    isDebug: false,
  }
}

export interface ILocation<TState = IState | null> extends Location {
  state: TState;
  key: any;
}

export interface IState {
  actionData?: IActionData;
}

//region Override

/**
 * PathResolver's "IEntry" doesn't define action types.
 * Accordingly, its resulting "Entry" also doesn't define the types of actions.
 */

export interface IEntry extends Omit<IEntryOrig, 'action' | 'canActivate' | 'canDeactivate'> {
  action?: (data: IActionData) => Promise<IActionResult>;
  canActivate?: (data: IActionData) => Promise<TCanActivateResult>;
  canDeactivate?: (tryRelocation: ILocation, data: IActionData) => Promise<boolean>;
}

export type TCanActivateResult = true | IActionResult;

export interface Entry extends Omit<EntryOrig, 'action' | 'canActivate' | 'canDeactivate'> {
  action?: IEntry['action'];
  canActivate?: IEntry['canActivate'];
  canDeactivate?: IEntry['canDeactivate'];
}

export interface IPathResolveResult extends Omit<IPathResolveResultOrig, 'entry'> {
  entry: Entry;
}

//endregion Override


export interface IActionData {

  target: IActionDataTarget;

  route: {
    note?: any;  // 'note' field defined in the route
    name?: string; // 'name' field defined in the route
  }

  /**
   * Context is unreliable!, because context will be null when:
   *   - user manually changes link in the browser line, then follows it;
   *   - user refreshed the page (F5)
   *   - user follows an uncontrolled direct link (I mean, you can't set the context when you click).
   * for independent reuse of values better use 'target.search' or 'note' fields
   */
  ctx: any;

  /**
   * A unique string associated with this location. May be used to safely store
   * and retrieve data in some other storage API, like `localStorage`.
   *
   * Note: This value is always "default" on the initial location.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.key
   */
  key: string;

  previous?: IActionData;

}

export interface IActionDataTarget extends IPath {
  pathnameParams: IPathnameParams;
}

export interface IActionResult {
  component?: any;
  redirectTo?: string;
  customTo?: ICustomTo;
}

export interface IEntryResult extends IActionResult {
  action?: Entry['action'];
}

export interface IResultListenersArg {
  component: any;
  actionData: IActionData;
}

export type To = IPath | string;
