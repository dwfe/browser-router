<p align="center">Router for any browser-based JavaScript app</p>

## Getting Started

Using the example for React.js:

1. [Define routes](https://github.com/dwfe/browser-router/blob/master/packages/tests-manual/src/router/routes.tsx#L10) (for a possible syntax for `path`, see [here](https://www.npmjs.com/package/path-to-regexp))
2. [Create `BrowserRouter` instance](https://github.com/dwfe/browser-router/blob/master/packages/tests-manual/src/di.ts#L17)
3. [Start `BrowserRouter`](https://github.com/dwfe/browser-router/blob/325524f8927765e4b0e7e320fa722990c8c3ba3f/packages/tests-manual/src/router/route-result.handler.tsx#L22)
4. [Receive and handle the routing result](https://github.com/dwfe/browser-router/blob/325524f8927765e4b0e7e320fa722990c8c3ba3f/packages/tests-manual/src/router/route-result.handler.tsx#L31)

and that's all you need to do to make the router work.

## Try Browser router

[demo](https://browser-router.github.io)
