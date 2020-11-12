import {ReactElement, useState} from 'react'
import {container} from 'tsyringe'
import {BrowserRouter} from '@do-while-for-each/browser-router'
import {Ctx} from './contract';

export const useRouter = (): [BrowserRouter<ReactElement, Ctx>] => {
  const [router] = useState(() => container.resolve<BrowserRouter<ReactElement, Ctx>>(BrowserRouter))
  return [router]
}
