import {IActionData, TRouteContext} from '@do-while-for-each/path-resolver'
import {HTMLProps} from 'react'

export interface IRoutableProps<TNote = any, TContext extends TRouteContext = TRouteContext> extends HTMLProps<any> {
  routeActionData?: IActionData<TNote, TContext>;
}
