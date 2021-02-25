import React from 'react'
import {useDIInstance} from '../../../hooks/use-di-instance'
import {ActionData, IRoutableProps} from '../../../router'
import {AuthService} from './auth.service'
import {QaSel} from '../../qa-selector'

export const ProtectedByAuthorization = (props: IRoutableProps) => {
  const [auth] = useDIInstance(AuthService)

  const logOut = () => auth.logOut()

  return (<div>
    <p>Congratulations!</p>
    <p>You have access to this protected by authorization page.</p>
    <button onClick={logOut} data-qa={QaSel.LoginPage_LogOut}>Log Out</button>
    <br/><br/>
    <ActionData actionData={props.routeActionData}/>
  </div>)
}
