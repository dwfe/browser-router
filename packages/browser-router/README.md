### Try it in action
[demo](https://browser-router.github.io)

### Doc
The first thing you need to do is [define routes](https://www.npmjs.com/package/@do-while-for-each/path-resolver#Routes).   
Then you can define options, although this is not necessary:
```ts
export interface IBrowserRouterOptions {
  enableTrace?: boolean;
  injectRouteActionsDataToComponent?: boolean;
  pathResolver?: IPathResolverOptions;
}
```
and finally, to create the router and start it:
```tsx
const router = new BrowserRouter(routes, options)

router.componentData$.pipe(
  tap(({component, routeActionData}) => {

    const container =
      <GeneralTemplate>
        {component}
      </GeneralTemplate>;

    ReactDOM.render(container, root)

  }),
).subscribe()

router.start()
```
In the example above, the router works with React components, but it doesn't really care about the type of component - `BrowserRouter` simply returns what is defined in your routes.

### Work algorithm


After starting, the router starts listening for location changes:
```ts
start(ctx?: TContext) {
  this.goWithoutChangingLocation(ctx)
  this.history.listen(this.onLocationChange.bind(this))
}

onLocationChange({location}: Update<TContext>) {
  this.locationHandler
    .processLocation(location)
    .then(task => this.routeActivation(task))
}
```
Here `history` is the functionality of the package [history](https://github.com/ReactTraining/history#readme).  
The `LocationHandler` purposes to handle each subsequent location change:
```ts
if (this.isTaskExist(taskId)) {
  this.trace(taskId, 'duplicate, skipped')
  return;
}
return this.resolveRoute({location, taskId})
  .then(data => this.createTask(data))
  .then(task => task.runLifecycle())
  .finally(() => this.removeTask(taskId))
```
  
The every location change is processed in a separate task:
```ts
runLifecycle = (): Promise<Task<TComponent, TContext, TActionResult, TNote>> =>
  this.stageCanActivate()
    .then(() => this.blockNavigation()) // if 'canDeactivate' is defined in the route
    .then(() => this.stageProcessResult(this.route))
    .then(() => this.stageInvokeRoutesAction())
    .then(() => this.stageSummarize())
    .catch(err => {
      this.unblockNavigation()
      throw err
    })
```
If any of the stages calculated the result, then all subsequent stages will be skipped.
  
As a result, when the location processing task is completed, the router only needs to call the result:
```ts
routeActivation(task?: Task) {
  if (!task)
    return;
  const {isCanceled, result, id} = task
  isCanceled
    ? this.trace(id, 'canceled')
    : result()
}
```
The result of the `BrowserRouter`'s work is either a redirect to another location, or a component for rendering:
```ts
export interface RoutingResult<TComponent = any, TContext extends RouteContext = RouteContext> {
  redirectTo?: string;
  customTo?: ICustomTo<TContext>;
  component?: TComponent;
  skip?: boolean; // if 'true' then stage 'CanActivate' will skip the processing to next stage
}
```


#### TODO
- может быть добавить доп. remote repo на github и линки всякие на него указывать?
- option: collecting statistics on the frequency of routes usage
- tests for BrowserRouter
- tests for PathResolver.correctResultFromAction

- ActivatedRoute - https://angular.io/guide/router#getting-route-information
                 - https://angular.io/guide/router#activated-route
- Lazy Loading route - https://angular.io/guide/router-tutorial-toh#lazy-loading-route-configuration
- relative paths in Link component - https://angular.io/guide/router#using-relative-paths
