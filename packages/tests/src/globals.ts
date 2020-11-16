import {Routes} from '@do-while-for-each/path-resolver'

export const routesFlat = (routes: Routes, res: Routes = []): Routes => {
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]
    res.push(route)
    if (route.children) {
      routesFlat(route.children, res)
      // delete route.children
    }
  }
  return res
}

export const removeChildren = (routes: Routes) =>
  routes.forEach(r => {
    if (r.children)
      delete r.children
  })
;

export const traverse = (routes: Routes | undefined, fn) => {
  if (!routes)
    return;

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]
    fn(route, i)
    traverse(route.children, fn)
  }
}

export class Traverse {
  totalCount = -1

  run(routes: Routes | undefined, fn) {
    if (!routes)
      return;

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      this.totalCount++
      fn(route, this.totalCount)
      this.run(route.children, fn)
    }
  }
}
