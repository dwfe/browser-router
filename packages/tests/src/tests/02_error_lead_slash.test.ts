import {describe, expect} from '@jest/globals'
import {PathResolver, Routes} from '@do-while-for-each/path-resolver'

describe(`error 'lead slash'`, () => {

  test('.', () => {
    expect(() => {
      new PathResolver([
        {path: ''},
        {path: '/hello'},
      ] as Routes)
    }).toThrowError(new Error(`Invalid configuration of route, because path [ /hello ] cannot start with a slash`))

    expect(() => {
      new PathResolver([
        {
          path: 'hello', children: [
            {path: ''},
            {path: '/world'},
          ]
        },
        {path: 'music'},
      ] as Routes)
    }).toThrowError(new Error(`Invalid configuration of route, because path [ /world ] cannot start with a slash`))
  })

})
