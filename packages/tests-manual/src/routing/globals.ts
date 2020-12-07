import {RouteActionData} from './contract';

export const getPreviousRouteActionData = (routeActionData?: RouteActionData): RouteActionData | undefined =>
  routeActionData
    ? routeActionData.previous
    : undefined
;


