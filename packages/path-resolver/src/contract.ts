import {State} from 'history'

export type Routes = Route[];

// export interface RouteContext extends State

export interface Route<TComponent = any,
  TContext extends State = State,
  TActionResult extends RoutingResult<TComponent, TContext> = RoutingResult<TComponent, TContext>,
  TNote = any>
  extends RoutingResult<TComponent, TContext> {

  path: string; // See syntax here: https://github.com/pillarjs/path-to-regexp#readme

  // extends from RoutingResult part:
  //   redirectTo?: string;
  //   customTo?: ICustomTo<TContext>;
  //   component?: TComponent;

  action?: (data: IActionData<TContext, TNote>) => Promise<TActionResult>;

  children?: Routes;

  note?: TNote;

}

export interface RoutingResult<TComponent = any, TContext extends State = State> {
  redirectTo?: string;
  customTo?: ICustomTo<TContext>;
  component?: TComponent;
}

export interface ICustomTo<TContext extends State = State> {
  pathname: string;
  isRedirect?: boolean;
  actionData?: IActionData<TContext>; // to pass as previous
}

export interface IActionData<TContext extends State = State, TNote = any> {
  targetGoTo: GoTo;

  data: {
    /**
     * Context data passed at click time.
     * Context is unreliable!, because context will be null when:
     *   - the user manually changes link in the browser line, then follows it (go to initial location);
     *   - the user follows an uncontrolled direct link (I mean, you can't set the context when you click).
     * better use GoTo.searchParams or route.note field
     */
    ctx: TContext;

    note?: TNote; // note field defined in the route
  }

  previous?: IActionData<TContext>;

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
  searchParams?: URLSearchParams; // parsed 'search' field


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
