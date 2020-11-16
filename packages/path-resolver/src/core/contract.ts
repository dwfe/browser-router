export type Routes = Route[];

export interface Route<TComponent = any,
  TContext extends RouteContext = RouteContext,
  TActionResult extends RoutingResult<TComponent, TContext> = RoutingResult<TComponent, TContext>,
  TNote = any>
  extends RoutingResult<TComponent, TContext> {

  path: string; // See syntax here: https://github.com/pillarjs/path-to-regexp#readme

  canActivate?: (data: IActionData<TContext, TNote>) => Promise<TActionResult>;

  // part extended from RoutingResult:
  //   redirectTo?: string;
  //   customTo?: ICustomTo<TContext>;
  //   component?: TComponent;

  action?: (data: IActionData<TContext, TNote>) => Promise<TActionResult>;

  children?: Routes;

  note?: TNote;

  name?: string;
}

export type RouteContext = {
  previousActionData?: IActionData<RouteContext>;
} | null // because history package type 'State' = object | null


export interface RoutingResult<TComponent = any, TContext extends RouteContext = RouteContext> {
  redirectTo?: string;
  customTo?: ICustomTo<TContext>;
  component?: TComponent;
  skip?: boolean; // if 'true' then 'stageCanActivate' will skip the processing to next stage
}

export interface ICustomTo<TContext extends RouteContext = RouteContext> {
  pathname: string;
  search?: string;
  hash?: string;
  isRedirect?: boolean; // if not set, it equals 'true'
}

export interface IActionData<TContext extends RouteContext = RouteContext, TNote = any> {

  target: GoTo;

  /**
   * Context is unreliable!, because context will be null when:
   *   - user manually changes link in the browser line, then follows it;
   *   - user refreshed the page (F5)
   *   - user follows an uncontrolled direct link (I mean, you can't set the context when you click).
   * for independent reuse of values better use 'target.search' or 'note' fields
   */
  ctx: TContext;

  note?: TNote; // note field defined in the route

  previous?: IActionData<TContext>;

  /**
   * A unique string associated with this location. May be used to safely store
   * and retrieve data in some other storage API, like `localStorage`.
   *
   * Note: This value is always "default" on the initial location.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.key
   */
  key: string;

}

export interface PathResolveResult {
  route: Route;
  pathParams: PathParams;
  parentRoute?: Route;
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

export interface IPathResolverOptions {
  enableTrace: boolean;
}

export const defaultOptions: IPathResolverOptions = {
  enableTrace: false,
}
