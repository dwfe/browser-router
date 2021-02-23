import {container, InjectionToken} from 'tsyringe'
import {useState} from 'react'

export const useDIInstance = <T>(token: InjectionToken<T>): [T] => {
  const [instance] = useState(() => container.resolve<T>(token))
  return [instance]
}
