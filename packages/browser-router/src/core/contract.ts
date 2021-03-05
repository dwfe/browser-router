import {IActionData, IPath, IPathResolverOptions, TRouteContext} from '@do-while-for-each/path-resolver'

export interface IBrowserRouterOptions {
  isDebug?: boolean;
  pathResolver?: IPathResolverOptions;
}

export const defaultOptions: IBrowserRouterOptions = {
  isDebug: true,
  pathResolver: {
    isDebug: true,
  }
}

export type To = IPath | string;

export interface IResultListenersArg<TComponent = any, TNote = any, TContext extends TRouteContext = TRouteContext> {
  component: TComponent;
  routeActionData: IActionData<TNote, TContext>
}
