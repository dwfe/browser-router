<p align="center">Router for any browser-based JavaScript app</p>

# Installation

Install by npm:

```shell
npm install --save @do-while-for-each/browser-router
```

or install with yarn:

```shell
yarn add @do-while-for-each/browser-router
```

# Getting Started

Using the example for React.js:

1. [Define routes](https://github.com/dwfe/test-manual-browser-router/blob/main/src/router/routes.tsx#L8) (for a possible syntax see [here](https://github.com/dwfe/path-resolver#pathresolver))
2. [Create `BrowserRouter` instance](https://github.com/dwfe/test-manual-browser-router/blob/main/src/di.ts#L13)
3. [Start `BrowserRouter`](https://github.com/dwfe/test-manual-browser-router/blob/main/src/router/route-result.handler.tsx#L24)
4. [Receive and handle the routing result](https://github.com/dwfe/test-manual-browser-router/blob/main/src/router/route-result.handler.tsx#L31)

and that's all you need to do to make the router work.

## Try Browser router

[demo](https://browser-router.github.io)

