import React from 'react'
import {ActionData, IRoutableProps} from '../../routing'
import {useAuth} from './useAuth'

export const ProtectedByAuthorization = (props: IRoutableProps) => {
  const [auth] = useAuth()

  const logOut = () => auth.logOut()

  return (<div>
    <p>Congratulations!</p>
    <p>You have access to this page.</p>
    <button onClick={logOut}>Log Out</button>
    <br/><br/>
    <ActionData actionData={props.routeActionData}/>
  </div>)
}
