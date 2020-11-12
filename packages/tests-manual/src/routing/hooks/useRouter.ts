import {useState} from 'react'
import {container, InjectionToken} from 'tsyringe'

export const useRouter = <T>(token: InjectionToken<T>): [T] => {
  const [router] = useState(() => container.resolve<T>(token))
  return [router]
}
