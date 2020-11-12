import {RouteActionData} from './contract';

export const getPreviousActionData = (currentActionData?: RouteActionData): RouteActionData | undefined => {
  if (currentActionData) {
    return currentActionData.previous
  }
}

