import {expect} from '@jest/globals'
import {routesTotalCount} from './routes'


export const lengthCheck = (flatRoutes,flatPathResolverRoutes, flatRoutesCheck) =>{
  expect(flatRoutes.length).toEqual(routesTotalCount)
  expect(flatPathResolverRoutes.length).toEqual(routesTotalCount)
  expect(flatRoutesCheck.length).toEqual(routesTotalCount)
}
