import {IActionData, RouteContext} from '@do-while-for-each/path-resolver'

export type RouteActionData = IActionData<Ctx, IRouteNote>

export type Ctx = RouteContext & {
  title?: string;
} | null // because history type 'State' = object | null

export interface IRouteNote {
  title?: string;
}
