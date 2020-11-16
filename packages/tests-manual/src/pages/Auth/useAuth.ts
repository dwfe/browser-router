import {useState} from 'react'
import {container} from 'tsyringe'
import {Auth} from './auth'

export const useAuth = (): [Auth] => {
  const [auth] = useState(() => container.resolve(Auth))
  return [auth]
}
