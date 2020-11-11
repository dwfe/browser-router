import {ReactElement, useState} from 'react'
import {container} from 'tsyringe'
import {BrowserRouter} from '@do-while-for-each/browser-router'
import {IRouteContext} from './contract';

export const useRouter = (): [BrowserRouter<ReactElement, IRouteContext>] => {
  const [router] = useState(() => container.resolve<BrowserRouter<ReactElement, IRouteContext>>(BrowserRouter))
  return [router]
}
