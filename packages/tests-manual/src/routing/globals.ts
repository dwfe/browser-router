import {RouteActionData} from './contract';

export const getPreviousRouteActionData = (routeActionData?: RouteActionData): RouteActionData | undefined => {
  if (routeActionData) {
    return routeActionData.previous
  }
}

