import {IActionData, TRouteContext} from '@do-while-for-each/path-resolver'
import {IResultListenersArg} from '@do-while-for-each/browser-router'
import {ReactElement} from 'react'

export type TRouteActionData = IActionData<IRouteNote, TCtx>
export type TRouteResultArg = IResultListenersArg<ReactElement, TRouteActionData>

export interface IRouteNote {
  title?: string;
}

export type TCtx = TRouteContext & { // this context for example
  title?: string;
} | null // because history package type 'State' = object | null


export interface IRouteResultHandlerOptions {
  injectData?: boolean;
}
