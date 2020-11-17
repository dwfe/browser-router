import React, {useState} from 'react'
import {ActionData, IRoutableProps} from '../../routing'
import {useDIInstance} from '../../di/useDIInstance'
import {AuthService} from './auth.service'

export const LoginPage = (props: IRoutableProps) => {
  const [auth] = useDIInstance(AuthService)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const checkAuth = () => {
    if (!(username && password))
      alert('fill fields with something')
    else
      auth.logIn(username, password)
  }

  return (<>
    <h3>Please log in</h3>
    <div>
      <label htmlFor="username">username:</label>
      <input required type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)}/>
    </div>
    <div>
      <label htmlFor="password">password:</label>
      <input required type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)}/>
    </div>
    <button onClick={checkAuth}>Check</button>
    <br/><br/>
    <ActionData actionData={props.routeActionData}/>
  </>)
}
