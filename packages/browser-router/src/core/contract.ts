import {IPathResolverOptions} from '@do-while-for-each/path-resolver'

export interface IBrowserRouterOptions {
  enableTrace: boolean;
  injectRouteActionsDataToComponent: boolean;
  pathResolver?: IPathResolverOptions;
}

export const defaultOptions: IBrowserRouterOptions = {
  enableTrace: false,
  injectRouteActionsDataToComponent: false,
  pathResolver: {
    enableTrace: false,
  }
}
