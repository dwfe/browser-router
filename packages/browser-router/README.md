## Try Browser router

[demo](https://browser-router.github.io)

## Getting Started

1. [Define routes](https://github.com/dwfe/browser-router/blob/master/packages/tests-manual/src/router/routes.tsx#L9)
2. [Create `BrowserRouter` instance](https://github.com/dwfe/browser-router/blob/master/packages/tests-manual/src/di.ts#L18)
3. [Start `BrowserRouter`](https://github.com/dwfe/browser-router/blob/master/packages/tests-manual/src/router/route-results.handler.tsx#L17)

## TODO

- Path.normalizePathname, а если location /app/123 и там сделать переход "hello/world"
- сделать чистый бандл
  - [чтобы без косяков](https://www.opennet.ru/opennews/art.shtml?num=54566)
- оформить
  - чтобы красиво выглядело
  - описание возможностей(мб взять из тестов)
  - Get started
  - добавить доп. remote repo на github и линки всякие на него указывать
    - раздел релизы на гитхабе
  - добавить Open collective или чета наподобии
  - обновить демо
  - добавить бейджики:
    - ссылка на npm
    - сбилджено
    - протестировано
- option: collecting statistics on the frequency of routes usage
- tests for PathResolver.correctResultFromAction

- ActivatedRoute - https://angular.io/guide/router#getting-route-information
  - https://angular.io/guide/router#activated-route
- Lazy Loading route - https://angular.io/guide/router-tutorial-toh#lazy-loading-route-configuration
- relative paths in Link component - https://angular.io/guide/router#using-relative-paths
