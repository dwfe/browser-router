import {IActionData} from '@do-while-for-each/path-resolver'

export type RouteActionData = IActionData<RouteContext>

export type RouteContext = IRouteContext | null // because history type 'State' = object | null

export interface IRouteContext {
  title?: string;
}

export interface IRouteNote {
  title?: string;
}
