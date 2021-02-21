import {IPath, IPathResolverOptions} from '@do-while-for-each/path-resolver'

export interface IBrowserRouterOptions {
  isDebug?: boolean;
  injectRouteActionsDataToComponent?: boolean;
  pathResolver?: IPathResolverOptions;
}

export const defaultOptions: IBrowserRouterOptions = {
  isDebug: true,
  injectRouteActionsDataToComponent: false,
  pathResolver: {
    isDebug: true,
  }
}

export type To = IPath | string;
