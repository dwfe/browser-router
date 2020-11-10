import {Action, State} from 'history'

export type Routes = Route[];

export interface Route<TComponent = any, TContext extends State = State, TActionResult extends RoutingResult<TComponent> = RoutingResult<TComponent>> extends RoutingResult<TComponent> {
  path: string;  // See syntax here: https://github.com/pillarjs/path-to-regexp#readme
  action?: (data: IActionData<TContext>) => Promise<TActionResult>;
  children?: Routes;
  name?: string;
}

export interface RoutingResult<TComponent = any> {
  redirectTo?: string;
  component?: TComponent;
}

export interface IActionData<TContext extends State = State> {
  ctx: TContext; // can be null !!!
  to: GoTo;
  /**
   * A unique string associated with this location. May be used to safely store
   * and retrieve data in some other storage API, like `localStorage`.
   *
   * Note: This value is always "default" on the initial location.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.key
   */
  key: string;
  /**
   * The action that triggered the change of route.
   */
  action: Action;
}

export interface PathResolveResult {
  route: Route;
  pathParams: PathParams;
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

  pathParams?: PathParams;
  searchParams?: URLSearchParams;


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
