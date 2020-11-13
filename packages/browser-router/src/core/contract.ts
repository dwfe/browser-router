export interface IBrowserRouterOptions {
  enableTrace: boolean;
  injectRouteActionsDataToComponent: boolean;
}

export const defaultBrowserRouterOptions: IBrowserRouterOptions = {
  enableTrace: false,
  injectRouteActionsDataToComponent: false,
}
