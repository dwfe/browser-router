import {TRouteActionData} from './contract'

export const getPreviousRouteActionData = (routeActionData?: TRouteActionData): TRouteActionData | undefined =>
  routeActionData
    ? routeActionData.previous
    : undefined
;


