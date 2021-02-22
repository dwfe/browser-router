import {IActionData, TRouteContext} from '@do-while-for-each/path-resolver'
import {HTMLProps} from 'react'

export type RouteActionData = IActionData<IRouteNote, Ctx>

export interface IRouteNote {
  title?: string;
}

export type Ctx = TRouteContext & {
  title?: string; // for example
} | null // because history package type 'State' = object | null


export interface IRoutableProps extends HTMLProps<any> {
  routeActionData?: RouteActionData;
}
