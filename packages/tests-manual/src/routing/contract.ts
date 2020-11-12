import {IActionData, RouteContext} from '@do-while-for-each/path-resolver'
import {HTMLProps} from 'react';

export type Ctx = RouteContext & {
  title?: string;
} | null // because history package type 'State' = object | null

export type RouteActionData = IActionData<Ctx, IRouteNote>

export interface IRouteNote {
  title?: string;
}

export interface IRoutableProps extends HTMLProps<any> {
  currentActionData?: RouteActionData;
}
