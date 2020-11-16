import React from 'react'
import {ActionData, IRoutableProps} from '../../routing'
import {useDIInstance} from '../../di/useDIInstance'
import {AuthService} from './auth.service'

export const ProtectedByAuthorization = (props: IRoutableProps) => {
  const [auth] = useDIInstance(AuthService)

  const logOut = () => auth.logOut()

  return (<div>
    <p>Congratulations!</p>
    <p>You have access to this protected by authorization page.</p>
    <button onClick={logOut}>Log Out</button>
    <br/><br/>
    <ActionData actionData={props.routeActionData}/>
  </div>)
}
