import {IActionData, IPath, IPathResolverOptions, TRouteContext} from '@do-while-for-each/path-resolver'

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

export interface IListenersData<TComponent = any, TNote = any, TContext extends TRouteContext = TRouteContext> {
  component: TComponent;
  routeActionData: IActionData<TNote, TContext>
}
