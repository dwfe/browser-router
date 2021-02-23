import {useState} from 'react'
import {container, InjectionToken} from 'tsyringe'

export const useDIInstance = <T>(token: InjectionToken<T>): [T] => {
  const [instance] = useState(() => container.resolve<T>(token))
  return [instance]
}
