import {PathResolver, Routes} from '@do-while-for-each/path-resolver';
import {routesCheck} from '../routes/routes.check';
import {routes} from '../routes/routes';
import {routesFlat} from './common';

export const initFlat = (): {
  pathResolver: PathResolver;
  flatRoutes: Routes;
  flatPathResolverRoutes: Routes;
  flatRoutesCheck: Routes;
} => {
  const pathResolver = new PathResolver(routes)
  const flatRoutes = routesFlat(routes, true)
  const flatPathResolverRoutes = routesFlat(pathResolver.routes, true)
  const flatRoutesCheck = routesFlat(routesCheck, true)
  return {
    pathResolver,
    flatRoutes,
    flatPathResolverRoutes,
    flatRoutesCheck,
  }
}
