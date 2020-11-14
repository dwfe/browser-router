import {IPathResolverOptions} from '@do-while-for-each/path-resolver'

export interface IBrowserRouterOptions {
  enableTrace: boolean;
  injectRouteActionsDataToComponent: boolean;
  pathResolver?: IPathResolverOptions;
}

export const defaultBrowserRouterOptions: IBrowserRouterOptions = {
  enableTrace: false,
  injectRouteActionsDataToComponent: false,
  pathResolver: {
    enableTrace: false,
  }
}
