export type Routes<TComponent = any, TActionContext = any, TActionResult = any> =
  Route<TComponent, TActionContext, TActionResult>[];

export interface Route<TComponent = any, TActionContext = any, TActionResult = any> {
  path: string;      // See: https://github.com/pillarjs/path-to-regexp#readme
  redirectTo?: string;
  component?: TComponent;
  action?: (ctx: TActionContext) => TActionResult;
  children?: Routes<TComponent, TActionContext, TActionResult>;

  name?: string;
}

export interface PathResolveResult {
  route: Route;
  params: PathParams
}

export type PathParams = {} | { [key: string]: string; }


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
