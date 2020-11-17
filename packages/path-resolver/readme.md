For the passed `pathname`, the `PathResolver` must resolve and return the `Route | undefined`:

```
export type Routes = Route[];

export interface Route<TComponent = any,
  TContext extends RouteContext = RouteContext,
  TActionResult extends RoutingResult<TComponent, TContext> = RoutingResult<TComponent, TContext>,
  TNote = any>
  extends RoutingResult<TComponent, TContext> {

  path: string; // see syntax here: https://github.com/pillarjs/path-to-regexp#readme

  canActivate?: (data: IActionData<TContext, TNote>) => Promise<TActionResult>;

  /**
   * part extended from RoutingResult:
   *  - redirectTo?: string;
   *  - customTo?: ICustomTo<TContext>;
   *  - component?: TComponent;
   */

  action?: (data: IActionData<TContext, TNote>) => Promise<TActionResult>;

  children?: Routes;

  note?: TNote;

  name?: string;
}
```
### Routes
Define your routes in your `Routes` array, for example:
```
export const routes: Route<ReactElement, Ctx, RoutingResult<ReactElement, Ctx>, IRouteNote>[] = [
  {path: '', component: <MainPage/>, note: {title: 'Index'}},
  {
    path: 'first', component: <FirstPage/>, note: {title: 'First page'}, children: [
      {path: 'to-pic', customTo: {pathname: '/second/12/pic', search: 'hello=world', hash: 'pic'}},
      {path: '(.*)', redirectTo: '/not-found'},
    ]
  },
  {
    path: 'second', component: <SecondPage/>, note: {title: 'Second page'}, children: [
      {
        path: ':page', children: [
          {path: 'pic', component: <PicPage/>, note: {title: 'Pic'}},
          {path: '(.*)', action: longTimeGettingOfActionResult},
        ]
      },
    ]
  },
  {path: 'protected-by-authorization', canActivate: passIfLoggedIn, component: <ProtectedByAuthorization/>},
  {path: 'login', component: <LoginPage/>},
  {path: 'not-found', component: <NotFound/>, note: {title: 'Not found page'}},
  {path: '(.*)', redirectTo: '/not-found'}
]

function longTimeGettingOfActionResult(data: RouteActionData): Promise<RoutingResult<ReactElement, Ctx>> {
  return new Promise(resolve => {
    setTimeout(() => resolve({redirectTo: 'pic'}), 5_000)
  })
}

async function passIfLoggedIn(data: RouteActionData): Promise<RoutingResult<ReactElement, Ctx>> {
  const auth = container.resolve(AuthService)
  if (auth.isLoggedIn())
    return {skip: true}
  else {
    auth.redirectTo = data.target // the user will be redirected here after successful login
    return {redirectTo: 'login'}
  }
}
```

The order of routes is important because the `PathResolver` uses a first-match wins strategy when matching routes, so more specific routes should be placed above less specific routes.
 
