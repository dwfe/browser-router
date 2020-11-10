import {State, Update} from 'history'

export type Routes = Route[];

export interface Route<TComponent = any, TContext extends State = State> {
  path: string;  // See syntax here: https://github.com/pillarjs/path-to-regexp#readme
  redirectTo?: string;
  component?: TComponent;
  action?: (data: IActionData<TContext>) => Promise<ActionResult<TComponent>>;
  children?: Routes;
  name?: string;
}

export interface IActionData<TContext extends State = State> extends Update<TContext> {
  pathParams: PathParams;
}

export interface ActionResult<TComponent = any> {
  redirectTo?: string;
  component?: TComponent;
}

export interface PathResolveResult {
  route: Route;
  pathParams: PathParams
}

export type PathParams = object | { [key: string]: string; }


export type ToType = GoTo | string;

export interface GoTo {
  /**
   * Returns the Location object's URL's path.
   *
   * Can be set, to navigate to the same URL with a changed path.
   */
  pathname?: string;

  /**
   * Returns the Location object's URL's query (includes leading "?" if non-empty).
   *
   * Can be set, to navigate to the same URL with a changed query (ignores leading "?").
   */
  search?: string;

  /**
   * Returns the Location object's URL's fragment (includes leading "#" if non-empty).
   *
   * Can be set, to navigate to the same URL with a changed fragment (ignores leading "#").
   */
  hash?: string;

  /**
   * Returns the Location object's URL's origin.
   */
  origin?: string;

  /**
   * Returns the Location object's URL.
   *
   * Can be set, to navigate to the given URL.
   */
  href?: string;

  /**
   * To open a new window on every call of window.open(), use the special value _blank for windowName.
   */
  target?: '_blank' | any;
}
