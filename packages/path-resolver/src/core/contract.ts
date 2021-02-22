import {Location} from 'history'

export type Routes = Route[]

export interface Route<TComponent = any,
  TContext extends RouteContext = RouteContext,
  TActionResult extends RoutingResult<TComponent> = RoutingResult<TComponent>,
  TNote = any>
  extends RoutingResult<TComponent> {

  path: string; // see syntax here: https://github.com/pillarjs/path-to-regexp#readme

  canActivate?: (data: IActionData<TContext, TNote>) => Promise<TActionResult>;
  canDeactivate?: (tryRelocation: Location<TContext>, data: IActionData<TContext, TNote>) => Promise<boolean>;

  /**
   * part extended from RoutingResult:
   *  - redirectTo?: string;
   *  - customTo?: ICustomTo<TContext>;
   *  - component?: TComponent;
   */

  action?: (data: IActionData<TContext, TNote>) => Promise<TActionResult>;

  children?: Routes;

  note?: TNote;

  name?: string;
}

export type RouteContext = {
  previousActionData?: IActionData<RouteContext>;
} | null // because history package type 'State' = object | null


export interface RoutingResult<TComponent = any> {
  redirectTo?: string;
  customTo?: ICustomTo;
  component?: TComponent;
  skip?: boolean; // if 'true' then stage 'CanActivate' will skip the processing to next stage
}

export interface IActionData<TContext extends RouteContext = RouteContext, TNote = any> {

  target: IActionDataTarget;

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

export interface ICustomTo extends IPath {
  isRedirect?: boolean; // if not set, it equals 'true'
}

export interface IActionDataTarget extends IPath {
  pathParams: PathParams;
}

export type PathParams = object | { [key: string]: string; }


export interface IPathResolverOptions {
  isDebug?: boolean;
}

export const defaultOptions: IPathResolverOptions = {
  isDebug: false,
}


export interface IPath {
  pathname?: string;
  search?: string;
  hash?: string;
}
